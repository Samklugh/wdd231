"""Build sharp responsive photographs from credited originals; cap each at 118 kB."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import html
import io
import json
import re
import ssl
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CACHE = Path(tempfile.gettempdir()) / 'jazz-discoveries-original-photos'
CACHE.mkdir(exist_ok=True)
LIMIT = 118_000
REPLACEMENTS = {
    'Ray Brown': 'File:In de serie Jazz At The Philharmonic in het Concertgebouw, optreden van het O\u2026, Bestanddeelnr 910-2885.jpg',
    'Ron Carter': 'File:Ron Carter DSC0352b.jpg',
    'Charlie Haden': 'File:Charlie Haden with Old and New Dreams 1978.jpg',
    'Elvin Jones': 'File:Elvin Jones.jpg',
    'Roy Haynes': 'File:Roy Haynes, 1964 (48127653736).jpg',
    'Gene Krupa': 'File:Gene Krupa.jpg',
    'Billy Cobham': 'File:The Billy Cobham Band Billy Cobham Unterfahrt-2012-10-23-005.jpg',
    'Terri Lyne Carrington': 'File:Terri Lyne Carrington DSC 1041z.jpg',
    'Kenny Burrell': 'File:Kenny Burrell VIS.jpg',
    'Bud Powell': 'File:Bud Powell (1953 publicity photo).jpg',
    'McCoy Tyner': 'File:McCoy Tyner 07 (loosely cropped).jpg',
    'Ahmad Jamal': 'File:Ahmad Jamal in Nashville, October 18, 2019.jpg',
    'Dexter Gordon': 'File:Dexter Gordon 1980.jpg',
    'Coleman Hawkins': 'File:Coleman Hawkins (Gottlieb 03991).jpg',
    'Wayne Shorter': 'File:Wayne Shorter 2012.jpg',
    'Ornette Coleman': 'File:Ornette Coleman 3.JPG',
    'Benny Carter': 'File:Benny Carter Billboard.jpg',
    'Freddie Hubbard': 'File:Freddie Hubbard.jpg',
    'Donald Byrd': 'File:Donald Byrd press photo 1975.jpg',
    'Clark Terry': 'File:Clark Terry.jpg',
    "Anita O'Day": "File:Anita O'Day (cropped).jpg",
    'Mel Torme': 'File:Mel Torme (4505898368).jpg',
    'Nat King Cole': 'File:Nat King Cole 1964.JPG',
}

def original(url):
    cached = CACHE / (hashlib.sha256(url.encode()).hexdigest() + '.image')
    if not cached.exists():
        for attempt in range(3):
            try:
                time.sleep(.8)
                request = urllib.request.Request(url, headers={'User-Agent': 'JazzDiscoveriesCourseProject/1.0'})
                with urllib.request.urlopen(request, context=ssl._create_unverified_context(), timeout=45) as response:
                    cached.write_bytes(response.read())
                break
            except urllib.error.HTTPError as error:
                if error.code != 429 or attempt == 2:
                    raise
                print('Waiting for image service:', url.rsplit('/', 1)[-1], flush=True)
                time.sleep(30)
    return ImageOps.exif_transpose(Image.open(cached)).convert('RGB')

def webp(image, target, width, height):
    image = image.copy()
    image.thumbnail((width, height), Image.Resampling.LANCZOS)
    while True:
        for quality in [86, 82, 78, 74]:
            image.save(target, 'WEBP', quality=quality, method=6)
            if target.stat().st_size <= LIMIT:
                return image.size, quality
        image = image.resize((int(image.width * .9), int(image.height * .9)), Image.Resampling.LANCZOS)

def main():
    musicians = json.loads((ROOT / 'data/musicians.json').read_text(encoding='utf-8'))
    sources = json.loads((ROOT / 'reports/sharp-photo-sources.json').read_text())
    candidate_file = ROOT / 'reports/sharp-photo-candidates.json'
    candidates = json.loads(candidate_file.read_text()) if candidate_file.exists() else {}
    inventory_path = ROOT / 'reports/sharp-image-inventory.json'
    inventory = json.loads(inventory_path.read_text()) if inventory_path.exists() else {}
    resized = json.loads((ROOT / 'reports/sharp-download-sources.json').read_text())

    def improve(musician):
        title = urllib.parse.unquote(urllib.parse.urlsplit(musician['photo']['source']).path.split('/wiki/')[1]).replace('_', ' ')
        info = sources.get(title)
        replacement = REPLACEMENTS.get(musician['name'])
        if replacement:
            selected = next((p for p in candidates.get(musician['name'], [])
                             if p['title'].replace('_', ' ') == replacement.replace('_', ' ')), None)
            if selected:
                info = selected['imageinfo'][0]
        if info is None:
            # A second run may already refer to a previously selected replacement.
            info = next(p['imageinfo'][0] for pages in candidates.values() for p in pages if p['title'].replace('_', ' ') == title)
        key = hashlib.sha256(info['url'].encode()).hexdigest()
        previous = inventory.get(musician['id'])
        if previous and previous['sourceKey'] == key and (ROOT / musician['photo']['src']).stat().st_size == previous['bytes']:
            return musician, previous
        source_title = urllib.parse.unquote(urllib.parse.urlsplit(info['descriptionurl']).path.split('/wiki/')[1]).replace('_', ' ')
        download_info = resized[source_title]
        image = original(download_info.get('thumburl') or download_info['url'])
        if musician['name'] == 'Ray Brown':
            image = image.crop((int(image.width * .58), int(image.height * .12),
                                int(image.width * .92), int(image.height * .73)))
        target = ROOT / musician['photo']['src']
        # Do not enlarge low-resolution source photographs or simulate detail.
        dimensions, quality = webp(image, target, 1000, 1400)
        small = target.with_name(target.stem + '-480.webp')
        small_dimensions, _ = webp(image, small, 480, 670)
        meta = info['extmetadata']
        plain = lambda text: html.unescape(re.sub('<[^>]+>', '', text)).strip()
        photo = musician['photo']
        photo.update(width=dimensions[0], height=dimensions[1],
            smallSrc='images/' + small.name, smallWidth=small_dimensions[0],
            source=info['descriptionurl'], artist=plain(meta.get('Artist', {}).get('value', 'Unknown photographer')),
            license=meta['LicenseShortName']['value'], licenseUrl=meta.get('LicenseUrl', {}).get('value', ''),
            changes='Resized from the source photograph and encoded as responsive WebP files; displayed with a CSS crop.')
        if musician['name'] == 'Ray Brown':
            photo['alt'] = 'Ray Brown playing double bass at the Concertgebouw in Amsterdam'
            photo['position'] = '50% 20%'
            photo['changes'] = 'Cropped to Ray Brown from the ensemble photograph, resized and converted to WebP.'
        if musician['name'] == 'Charlie Haden':
            photo['alt'] = 'Charlie Haden with Old and New Dreams at Keystone Korner'
            photo['position'] = '35% 25%'
        result = dict(sourceKey=key, width=dimensions[0], height=dimensions[1], bytes=target.stat().st_size,
                      smallBytes=small.stat().st_size, quality=quality, sourceWidth=image.width, sourceHeight=image.height)
        return musician, result

    failures = []
    with ThreadPoolExecutor(max_workers=2) as pool:
        pending = {pool.submit(improve, m): m for m in musicians}
        for future in as_completed(pending):
            m = pending[future]
            try:
                updated, result = future.result()
                inventory[m['id']] = result
                (ROOT / 'data/musicians.json').write_text(json.dumps(musicians, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
                inventory_path.write_text(json.dumps(inventory, indent=2) + '\n', encoding='utf-8')
                print(updated['name'], result['width'], 'px;', result['bytes'], 'bytes', flush=True)
            except Exception as error:
                failures.append((m['name'], str(error)))
                print('RETRY NEEDED:', m['name'], str(error), flush=True)
    if failures:
        raise RuntimeError(failures)
    print('All 85 portraits rebuilt from source photographs.', flush=True)

if __name__ == '__main__':
    main()
