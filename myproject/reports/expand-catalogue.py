"""Reproducible catalogue expansion and photo provenance download."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import collections
import html
import io
import json
import re
import ssl
import time
import urllib.parse
import urllib.request
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ROSTER = {
    'Bass': '''Ray Brown|Ray Brown (musician)|Swing|Soular Energy|A double bassist known for his long collaboration with Oscar Peterson.
Ron Carter||Post-bop|The Golden Striker|A bassist who played in Miles Davis's second great quintet.
Jaco Pastorius||Jazz fusion|Jaco Pastorius|An electric bassist known for his fretless sound and work with Weather Report.
Marcus Miller||Jazz fusion|The Sun Don't Lie|An electric bassist and composer whose music connects jazz with funk.
Oscar Pettiford||Bebop|The New Oscar Pettiford Sextet|A double bassist and cellist associated with the development of bebop.
Christian McBride||Post-bop|Gettin' to It|A bassist and bandleader working across small-group and big-band jazz.
Dave Holland|Dave Holland (bassist)|Post-bop|Conference of the Birds|A bassist and composer whose ensembles explore intricate rhythms.
Charlie Haden||Post-bop|Beyond the Missouri Sky|A bassist known for his work with Ornette Coleman and his own ensembles.
Stanley Clarke||Jazz fusion|School Days|A bassist associated with electric jazz fusion and Return to Forever.
Esperanza Spalding||Vocal jazz|Esperanza|A bassist, singer and composer who combines instrumental and vocal expression.''',
    'Drums': '''Max Roach||Bebop|We Insist!|A drummer and composer associated with bebop and music addressing civil rights.
Elvin Jones||Modal jazz|The Real McCoy|A drummer whose layered rhythms helped shape John Coltrane's quartet.
Tony Williams|Tony Williams (drummer)|Jazz fusion|Emergency!|A drummer who played with Miles Davis and led the fusion group Lifetime.
Roy Haynes||Post-bop|Out of the Afternoon|A drummer known for crisp accents and a distinctive rhythmic approach.
Philly Joe Jones||Hard bop|Blues for Dracula|A drummer who played in Miles Davis's first great quintet.
Buddy Rich||Swing|Big Swing Face|A drummer and big-band leader known for speed and technical command.
Gene Krupa||Swing|Sing, Sing, Sing|A swing drummer whose work with Benny Goodman brought drums into the spotlight.
Jack DeJohnette||Post-bop|Special Edition|A drummer, composer and bandleader known for wide-ranging musical collaborations.
Billy Cobham||Jazz fusion|Spectrum|A drummer associated with jazz fusion and the Mahavishnu Orchestra.
Terri Lyne Carrington||Post-bop|The Mosaic Project|A drummer, composer and bandleader whose projects bring together varied musical voices.''',
    'Guitar': '''Django Reinhardt||Gypsy jazz|Minor Swing|A guitarist whose work with Stephane Grappelli helped shape European jazz.
Charlie Christian||Swing|Solo Flight|An electric guitarist who helped establish the instrument as a jazz solo voice.
Kenny Burrell||Hard bop|Midnight Blue|A guitarist whose playing connects jazz improvisation with the blues.
Jim Hall|Jim Hall (musician)|Post-bop|Concierto|A guitarist known for thoughtful phrasing and close musical conversation.
Joe Pass||Post-bop|Virtuoso|A guitarist known for solo performances combining melody, harmony and bass lines.
Al Di Meola||Jazz fusion|Elegant Gypsy|A guitarist whose recordings combine jazz fusion with acoustic and Latin influences.
George Benson||Soul jazz|The George Benson Cookbook|A guitarist and vocalist whose work spans jazz, soul and popular music.
Pat Metheny||Jazz fusion|Bright Size Life|A guitarist and composer known for a distinctive sound and varied ensembles.
John Scofield||Jazz fusion|A Go Go|A guitarist whose playing brings jazz together with blues and funk.
Emily Remler||Hard bop|Firefly|A guitarist whose recordings draw on bebop, swing and blues traditions.''',
    'Piano': '''Oscar Peterson||Swing|Night Train|A pianist known for technical fluency and long-running trio collaborations.
Art Tatum||Swing|Piano Starts Here|A pianist known for elaborate harmonies and extraordinary technical facility.
Bud Powell||Bebop|The Amazing Bud Powell|A pianist whose single-note lines helped define the language of bebop piano.
Mary Lou Williams||Swing|Zodiac Suite|A pianist, composer and arranger whose work spans several jazz eras.
McCoy Tyner||Modal jazz|The Real McCoy|A pianist whose powerful chordal approach helped shape John Coltrane's quartet.
Chick Corea||Jazz fusion|Light as a Feather|A pianist and composer who worked in acoustic jazz and electric fusion.
Ahmad Jamal||Post-bop|At the Pershing: But Not for Me|A pianist known for space, dynamics and carefully shaped trio arrangements.
Keith Jarrett||Post-bop|The Koln Concert|A pianist known for improvised solo concerts and acoustic ensemble work.
Horace Silver||Hard bop|Song for My Father|A pianist and composer whose music blends hard bop with blues and gospel influences.
Erroll Garner||Swing|Concert by the Sea|A pianist known for a swinging left hand and lyrical, rhythmically free melodies.''',
    'Saxophone': '''Sonny Rollins||Hard bop|Saxophone Colossus|A tenor saxophonist known for developing small melodic ideas into extended improvisations.
Dexter Gordon||Hard bop|Go!|A tenor saxophonist known for a broad tone and relaxed phrasing.
Stan Getz||Cool jazz|Getz/Gilberto|A tenor saxophonist associated with a lyrical sound and jazz bossa nova recordings.
Coleman Hawkins||Swing|Body and Soul|A tenor saxophonist whose recordings helped establish the instrument as a jazz solo voice.
Lester Young||Swing|The President Plays with the Oscar Peterson Trio|A tenor saxophonist known for a light tone and flowing rhythmic phrasing.
Wayne Shorter||Post-bop|Speak No Evil|A saxophonist and composer who played with Miles Davis and Weather Report.
Cannonball Adderley||Hard bop|Somethin' Else|An alto saxophonist whose playing joins bebop fluency with blues and soul.
Gerry Mulligan||Cool jazz|Night Lights|A baritone saxophonist and arranger associated with cool jazz and pianoless ensembles.
Ornette Coleman||Free jazz|The Shape of Jazz to Come|A saxophonist and composer whose ensembles explored freer approaches to improvisation.
Benny Carter||Swing|Further Definitions|A saxophonist, trumpeter and arranger whose career helped shape swing-era orchestral jazz.''',
    'Trumpet': '''Clifford Brown||Hard bop|Study in Brown|A trumpeter known for a warm sound and fluent bebop lines.
Lee Morgan||Hard bop|The Sidewinder|A trumpeter whose recordings connect hard bop with blues and soul rhythms.
Freddie Hubbard||Post-bop|Red Clay|A trumpeter known for a powerful sound and wide-ranging improvisation.
Chet Baker||Cool jazz|Chet Baker Sings|A trumpeter and singer known for intimate phrasing and a lyrical approach.
Roy Eldridge||Swing|Little Jazz|A trumpeter whose energetic playing connects swing-era jazz with later developments.
Fats Navarro||Bebop|The Fabulous Fats Navarro|A trumpeter associated with the rapid melodic language of bebop.
Donald Byrd||Hard bop|A New Perspective|A trumpeter whose recordings range from hard bop to soul and funk influences.
Woody Shaw||Post-bop|Rosewood|A trumpeter and composer known for wide intervals and harmonically adventurous playing.
Wynton Marsalis||Post-bop|Black Codes (From the Underground)|A trumpeter and composer whose work includes small ensembles and jazz orchestra.
Clark Terry||Swing|In Orbit|A trumpeter and flugelhorn player known for a buoyant sound and playful phrasing.''',
    'Voice': '''Nina Simone||Vocal jazz|Little Girl Blue|A singer and pianist whose work draws on jazz, blues, gospel and classical music.
Carmen McRae||Vocal jazz|Carmen Sings Monk|A jazz singer known for thoughtful interpretations and precise rhythmic phrasing.
Betty Carter||Vocal jazz|The Audience with Betty Carter|A singer known for adventurous improvisation and close interaction with her ensembles.
Anita O'Day||Vocal jazz|Anita Sings the Most|A jazz singer whose phrasing treats the voice as a rhythmically flexible instrument.
Dinah Washington||Vocal jazz|Dinah Jams|A singer whose recordings cross jazz, blues and popular song.
Abbey Lincoln||Vocal jazz|Abbey Is Blue|A jazz singer and songwriter known for expressive storytelling.
Dianne Reeves||Vocal jazz|Beautiful Life|A jazz singer known for expressive storytelling and improvisation.
Mel Torme|Mel Tormé|Vocal jazz|Mel Torme Sings Fred Astaire|A singer and songwriter known for smooth phrasing and scat improvisation.
Nat King Cole||Vocal jazz|After Midnight|A singer and pianist whose recordings include jazz trio work and vocal standards.
Gregory Porter||Vocal jazz|Liquid Spirit|A singer and songwriter whose music draws on jazz, soul and gospel.''',
}
PROMPTS = {
    'Bass': 'Follow the bass line and notice how it supports the melody while shaping the pulse.',
    'Drums': 'Listen for the cymbal pulse, then notice how drum accents respond to the other musicians.',
    'Guitar': 'Focus on the guitar tone and the movement between single notes and chords.',
    'Piano': 'Follow the melody, then notice how the pianist adds harmony and rhythmic movement underneath.',
    'Saxophone': 'Notice the breath, tone and phrasing, then follow how a melodic idea changes during a solo.',
    'Trumpet': 'Listen to the shape of each phrase and how the trumpet moves between space and intensity.',
    'Voice': 'Listen to the timing of the words and the way the singer reshapes a familiar melody.',
}

def request_json(host, params):
    url = host + '?' + urllib.parse.urlencode(params)
    request = urllib.request.Request(url, headers={'User-Agent': 'JazzDiscoveriesCourseProject/1.0'})
    # The host's certificate bundle rejects the network proxy's CA constraints.
    with urllib.request.urlopen(request, context=ssl._create_unverified_context(), timeout=45) as response:
        return json.load(response)

def main():
    existing = json.loads((ROOT / 'data/musicians.json').read_text(encoding='utf-8'))
    assert len(existing) == 15, 'Run this expansion once, against the original 15 musicians.'
    additions = []
    for instrument, rows in ROSTER.items():
        for line in rows.splitlines():
            name, title, style, recording, bio = line.split('|')
            wiki_title = title or name
            additions.append(dict(
                id=str(16 + len(additions)), name=name, instrument=instrument,
                style=style, recording=recording, bio=bio, note=PROMPTS[instrument],
                url='https://www.youtube.com/results?search_query=' + urllib.parse.quote(name + ' ' + recording),
                biographySource='https://en.wikipedia.org/wiki/' + urllib.parse.quote(wiki_title.replace(' ', '_')),
                wikiTitle=wiki_title,
            ))
    discovery = {}
    for start in range(0, len(additions), 40):
        result = request_json('https://en.wikipedia.org/w/api.php', dict(
            action='query', titles='|'.join(m['wikiTitle'] for m in additions[start:start+40]),
            redirects=1, prop='pageimages|extracts', piprop='original|thumbnail',
            pithumbsize=400, exintro=1, explaintext=1, exsentences=2, format='json'))
        discovery.update({m['title']: m for m in result['query']['pages'].values()})
    (ROOT / 'reports/expanded-photo-discovery.json').write_text(json.dumps(discovery, indent=2), encoding='utf-8')
    missing = [m['name'] for m in additions if not discovery.get(m['wikiTitle'], {}).get('thumbnail')]
    if missing:
        raise ValueError('Missing musician portraits: ' + ', '.join(missing))
    file_titles = ['File:' + urllib.parse.unquote(urllib.parse.urlsplit(discovery[m['wikiTitle']]['original']['source']).path.rsplit('/', 1)[1]) for m in additions]
    licenses = {}
    for start in range(0, len(file_titles), 40):
        result = request_json('https://commons.wikimedia.org/w/api.php', dict(
            action='query', titles='|'.join(file_titles[start:start+40]), prop='imageinfo',
            iiprop='url|extmetadata', format='json'))
        licenses.update({m['title'].replace('_', ' '): m for m in result['query']['pages'].values()})
    (ROOT / 'reports/expanded-photo-licenses.json').write_text(json.dumps(licenses, indent=2), encoding='utf-8')

    def download(m):
        page = discovery[m['wikiTitle']]
        filename = urllib.parse.unquote(urllib.parse.urlsplit(page['original']['source']).path.rsplit('/', 1)[1])
        info = licenses[('File:' + filename).replace('_', ' ')]['imageinfo'][0]
        meta = info['extmetadata']
        license_name = meta.get('LicenseShortName', {}).get('value', '')
        assert license_name in ['Public domain', 'CC0', 'CC BY-SA 2.0', 'CC BY-SA 3.0', 'CC BY-SA 4.0', 'CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 2.5', 'No restrictions', 'Attribution', 'CC BY-SA 3.0 nl', 'CC BY-SA 3.0 de'], (m['name'], license_name)
        url = page['thumbnail']['source'].split('?')[0]
        req = urllib.request.Request(url, headers={'User-Agent': 'JazzDiscoveriesCourseProject/1.0'})
        slug = re.sub(r'[^a-z0-9]+', '-', m['name'].lower()).strip('-')
        target = ROOT / 'images' / (slug + '.webp')
        if target.exists():
            image = Image.open(target)
        else:
            time.sleep(2)
            try:
                response = urllib.request.urlopen(req, context=ssl._create_unverified_context(), timeout=45)
            except urllib.error.HTTPError as error:
                if error.code != 429:
                    raise
                time.sleep(min(45, int(error.headers.get('Retry-After', '30'))))
                response = urllib.request.urlopen(req, context=ssl._create_unverified_context(), timeout=45)
            with response:
                image = ImageOps.exif_transpose(Image.open(io.BytesIO(response.read()))).convert('RGB')
            image.thumbnail((240, 300))
            quality = 58
            while True:
                image.save(target, 'WEBP', quality=quality, method=6)
                if target.stat().st_size <= 4300 or quality <= 28:
                    break
                quality -= 6
        plain = lambda text: html.unescape(re.sub('<[^>]+>', '', text)).strip()
        m['photo'] = dict(src='images/' + target.name, width=image.width, height=image.height,
            alt='Photograph of ' + m['name'], source=info['descriptionurl'],
            artist=plain(meta.get('Artist', {}).get('value', 'Unknown photographer')),
            license=license_name, licenseUrl=meta.get('LicenseUrl', {}).get('value', ''),
            changes='Resized and converted to WebP; displayed with a cropped card preview.')
        del m['wikiTitle']
        return m['name'], target.stat().st_size

    with ThreadPoolExecutor(max_workers=1) as pool:
        for name, size in pool.map(download, additions):
            print(name, size, 'bytes', flush=True)
    for m in additions:
        target = ROOT / m['photo']['src']
        if target.stat().st_size > 3000:
            image = Image.open(target).convert('RGB')
            for quality in range(52, 21, -6):
                image.save(target, 'WEBP', quality=quality, method=6)
                if target.stat().st_size <= 3000:
                    break
            while target.stat().st_size > 3000:
                image = image.resize((int(image.width * .85), int(image.height * .85)), Image.Resampling.LANCZOS)
                image.save(target, 'WEBP', quality=40, method=6)
            m['photo']['width'], m['photo']['height'] = image.size
    all_musicians = existing + additions
    assert len(all_musicians) == 85
    assert len({m['name'] for m in all_musicians}) == 85
    (ROOT / 'data/musicians.json').write_text(json.dumps(all_musicians, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    e = html.escape
    credits = []
    for m in all_musicians:
        c = m['photo']
        license_text = ('<a href="' + e(c['licenseUrl']) + '">' + e(c['license']) + '</a>') if c['licenseUrl'] else e(c['license'])
        credits.append('<li><a href="' + e(c['source']) + '">' + e(m['name']) + ' photograph</a> &mdash; ' + e(c['artist']) + '. ' + license_text + '.</li>')
    file = ROOT / 'attributions.html'
    text = file.read_text(encoding='utf-8')
    text = re.sub(r'(<ul class="photo-credits">).*?(</ul>)', lambda match: match[1] + '\n' + '\n'.join(credits) + '\n' + match[2], text, flags=re.S)
    text = text.replace('<h2>Music and learning</h2>', '<h2>Music and learning</h2>\n<p>Expanded musician profiles also reference the individual Wikipedia biographies linked below. Style labels and listening prompts are editorial introductions.</p>\n<details><summary>Musician biography sources</summary><ul>' + ''.join('<li><a href="' + e(m['biographySource']) + '">' + e(m['name']) + '</a></li>' for m in additions) + '</ul></details>')
    file.write_text(text, encoding='utf-8')
    print('Category counts:', dict(collections.Counter(m['instrument'] for m in all_musicians)))

if __name__ == '__main__':
    main()
