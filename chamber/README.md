# London Chamber of Commerce

Open `index.html` or `directory.html` with VS Code Live Server (or run `python -m http.server 8000` from the repository root and visit `http://localhost:8000/chamber/`). HTTP is required for JSON fetches and JavaScript modules.

## Home page

The home page reuses the directory header, navigation, footer, Google Fonts, and shared styles. It includes a responsive London hero image, a Join link, two illustrative October 2026 events, current London weather, a three-day forecast, and three randomly selected Gold or Silver members. Events are fictional course-project content; update their dates as the project develops. Join and Discover remain placeholders for later assignments.

### Activate live weather

The supplied OpenWeatherMap API key is configured in `scripts/weather-config.js`. Both London endpoints were verified successfully: current temperature and description were returned, along with 40 three-hour forecast samples. Update `weatherApiKey` in that file if you replace the key.

The page calls OpenWeatherMap's current-weather and 5-day / 3-hour forecast endpoints for London (51.5074, -0.1278), using metric units. Three future London calendar days are shown with dates and forecast low/high temperatures derived from each day's three-hour samples. Date grouping uses Europe/London, including daylight-saving changes. These are sample-based forecast ranges, not a separate daily forecast product.

A static site's API key is visible in browser requests and source; use a dedicated course-project key. Failed requests show a readable unavailable message, without displaying invented weather values or preventing other sections from loading.

- Current weather documentation: https://openweathermap.org/current
- Forecast documentation: https://openweathermap.org/forecast5

## Design and assets

Charcoal #292b2c, burgundy #743c46, warm white #f6f5f2, Georgia headings and Roboto body text. The home page stacks on mobile; larger screens place events beside weather and display three spotlight cards in a row. The directory retains its grid/list layouts.

The London hero is a locally stored, cropped Unsplash photograph, provided in 720px and 1440px WebP versions, each below 125 kB. Source: https://images.unsplash.com/photo-1513635269975-59663e0ac1ad . Licence: https://unsplash.com/license . The image shows Tower Bridge, the Thames, and London's skyline.

Nine fictional member businesses use locally stored Font Awesome Brands 6.7.2 SVG icons as sample graphics. Original licence notices are preserved; see `images/font-awesome-LICENSE.txt`. Member contact details are sample data and website links use example.com. Spotlight selection fetches `data/members.json` using async/await and shuffles eligible members without duplicates.

## Validation

Checked JavaScript syntax, local resource links, image alt attributes, heading/ID structure, and hero file sizes. Functional checks cover 100 random spotlight selections, membership filtering, duplicate prevention, unchanged source data, London midnight and daylight-saving dates, daily forecast aggregation, mocked weather rendering, independent request failures, and missing-key handling. Headless Edge loaded the home page and all three member cards. Live requests to both OpenWeatherMap endpoints succeeded with the configured key.

Publish under https://samklugh.github.io/wdd231/chamber/ to match the Open Graph URLs. Run the published course audit and Lighthouse after deployment. Social links currently lead to platform home pages, not chamber accounts.
