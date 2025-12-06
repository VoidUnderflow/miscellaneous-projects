#### Project structure conventions(?)
- `/app` = contains routes, components, logic;
- `/app/lib` = functions used in the app; e.g: utility or data fetching functions;
- `/app/ui` = UI components; e.g: cards, tables, forms;
	- `globals.css`? interesting place to put it I guess. Needs to be imported in `/app/layout.tsx`
- `/public` = static assets;

I think I'm starting to become partial to keeping the `app` folder only for routes + layout.

Then, separate `src` folder which can contain folders like `components`, `features`, `lib`, `hooks`, `styles`

#### Fonts
Can import fonts directly from Google, they will be automatically downloaded when building the site.

e.g:
```ts
import {Inter} from 'next/font/google';
export const inter = Inter({subsets: ['latin']});
```

Including it in body:
```tsx
<body className={`${inter.className} antialiased`}>{children}</body>
```

#### Images
`<Image>` component:
- prevents layout shift when images are loading
- resizes images
- lazy loading

#### Routing
Nested folders -> routes. Each folder === route segment
`page.tsx` = required for the route to be accessible
`layout.tsx` = UI that is shared between sub-pages; `children` prop can either be a page or another layout;

#### Navigation
`<Link>`: key, href + can put something like an icon inside of it;
Next prefetches the code for the linked route in the background => faster navigation.

Showing active links: `usePathname` hook, which returns the current link's address.

#### Fetching data
When to query the DB?
- Through API endpoints, in the frontend.
- If using RSCs, can query it directly, skipping the API.

RSCs advantages when fetching data:
- No need for hooks like `useEffect`, `useState`. Can use `async/await`.
- They run on the server -> can send the result to the client.
- Can query DB directly, without an API layer.

For mutations, use server actions.

Request waterfall => sequential awaits. Can use `await Promise.all(...)`.

**Static rendering**:
- data fetching + rendering happens on the server, at build time or when revalidating the data
- useful for UI with no data or data shared across users

**Dynamic rendering:**
- Content rendered on the server, for each user at request time
- Used for real-time / user-specific / request time information
- Application is as fast as the slowest data fetch (but we can have placeholders)

#### Streaming
[Tutorial source](https://www.freecodecamp.org/news/the-nextjs-15-streaming-handbook/)
- Can start rendering the component tree on the server. Whenever a boundary is encountered (maybe implicitly through `loading.js`) React can pause, flush HTML + stream it to the browser.
- Automatic streaming -> by creating a `loading.js` file alongside a route  / layout segment. Next.js detects it -> renders skeleton + streams rest of page as data becomes available.
- Manual streaming -> wrap specific parts of the UI. Those segments will stream independently. (yay, another wrapper!).
- React automatically knows which chunks correspond to which components => hydrate incrementally.

Have to be careful about false interactions with SSR (server-side rendering) = reverting a user's action because it had no effect anyway.

Lifecycle (no streaming):
1. SSR = server runs React code, produces HTML with the initial data baked in -> server sends HTML + JS bundle to the browser. 
2. Browser parses HTML into the DOM. Page is visible, but not interactive.
3. Hydration -> the JS bundle is loaded -> React parses the DOM, matches it with its virtual DOM structure and attaches event listeners => page is interactive.
4. Client re-renders as normal on appropriate state changes.

With streaming, the server streams HTML chunks + React can hydrate them as they come.
Relevant: https://react.dev/reference/react/Suspense

How to actually do streaming:
- Create a loading.js file next to the page.js. This makes page.js be automatically wrapped in a Suspense boundary. Then you can replicate page.js in loading.js, replacing the elements you'll stream with placeholders like Skeleton (https://ui.shadcn.com/docs/components/skeleton). No granularity with this approach, but can show a placeholder page.
- Manually: You wrap things in Suspense, fallback = Skeleton for each component. I'd prefer this just so I don't have to create more folder duplication.

#### Route Groups
If you want `loading.tsx` not to be applied to sub-pages, can use route groups. 
e.g: `(folderName)`

Caveat: `(bla1)/about` and `(bla2)/about` both resolve to `/about`

#### URL Search params
Advantages:
- Bookmarkable + shareable URL
- Server-side rendering
- Analytics + tracking is easier

Useful hooks:
- `useSearchParams` = access params of current URL
  e.g: `/dashboard/invoices?page=1&query=pending` -> `{page: '1', query: 'pending'}`;
- `usePathName`;
- `useRouter` -> enables navigation between routes; https://nextjs.org/docs/app/api-reference/functions/use-router#userouter

https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

Also, can use `searchParams` as prop to a page function.
```tsx
export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;

}) {}
```

Client component -> `useSearchParams()` hook
Server component -> `searchParams` prop from the page to the component

#### Debouncing
When you type "bla" + update params => 
"b" "bl" "bla"

Can use `use-debounce` library, e.g: `useDebouncedCallback`

#### Server actions
React Server Actions (RSAs):
- run async code directly on the server => no need for API endpoints;
- can be invoked from Client or Server components;
- extra features: input checks, error message hashing, host restrictions, encrypted closures;

e.g: `action` attribute in `<form>` elements => action will automatically receive the `FormData` object (https://developer.mozilla.org/en-US/docs/Web/API/FormData);

When you want to refresh data, need to take into account the client-side router cache (stores route segments in user's browser). Trigger a refresh + new request with `revalidatePath`.

e.g: `revalidatePath('/dashboard/invoices')`

#### Dynamic route segment
e.g: `[id]`

#### bind()
`() => deleteInvoice(id)` -> cannot serialize to HTML
`deleteInvoice.bind(null, id)` -> can serialize to HTML
RSAs cannot 

#### Errors
Of course, the classic `try/catch`.
If something slips through though, good idea to have an `error.tsx` fallback. It defined a UI boundary for a route segment == catch-all for unexpected errors => fallback UI.

The component in `error.tsx` will receive the error and a reset function as parameters. The reset function will try to re-render the route segment.

**Trying to fetch a resource that doesn't exist:** `not-found.tsx` is what gets shown when you trigger the `notFound()` function.

#### Accessibility
`eslint-plugin-jsx-a11y`: include `"lint": "next lint"` under scripts -> `pnpm lint`

#### Form validation
##### Client-side
Simple way: add `required` attribute to the `<input>` and `<select>` elements in the form.

##### Server-side
Benefits:
- Ensure data is in the expected format before sending it to the DB
- Reduce the risk of malicious users bypass client-side validation (tbh, never trust client-side validation...)
- Have one source of truth for what is considered valid data
`useActionState` => will need to convert form to a client component;

#### Authentication
https://authjs.dev/reference/nextjs (next-auth)

Example config (root `auth.config.ts`, imported in `proxy.ts`):
```ts
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
```
`authorized` callback:
- checks if request is authorized to access a page, called before the request is completed; 
- receives an object with the `auth` and `request` properties.
	- `auth` = user's session;
	- `request` = incoming req;
- `providers`: array which contains different login options;

##### Sign In / Sign Out
- `signIn(provider, formData)` = trigger authentication with specified provider
- `signOut({ redirectTo })` = end session + redirect
- Both can be called from server actions

##### Auth Errors
- `AuthError` = base class for auth errors; check `error.type` for specifics
- **Must re-throw non-auth errors** - NextAuth uses thrown redirects internally

##### Form + Server Action Integration
- `useActionState(action, initialState)` → `[state, formAction, isPending]`
  - `state` = return value from last action call (e.g., error message)
  - `formAction` = pass to `<form action={...}>`
  - `isPending` = loading state during submission
- Hidden inputs pass extra data to server actions (e.g., redirect destination)

# SEO
Notes from the official tutorial: https://nextjs.org/learn/seo/importance-of-seo

Crawler refresher: Find URL (user search, links between websites, XML sitemaps) -> Add to crawl queue -> HTTP request (200: crawls, 30x: follows redirect, etc.) -> Render queue -> Indexed or not.

Should be identified by the `User-Agent` header.

`robots.txt`: tells crawlers which pages/files crawler can or can't request;

## XML sitemap
When to use:
- large site;
- archive of pages which are not well-connected to the rest of the website;
- new site + few external links to it;
- a lot of video/images;
Should be dynamically updated as the site changes.
Might be an interesting exercise to write one for your website.

## Meta robot tags
Tags + `robots.txt` are directives and will always be obeyed.
Common tag: `<meta name="robots" content="noindex,nofollow"/>`:
- `noindex` -> don't show in search results;
- `nofollow` -> don't follow the links on this page;
Put tags in `<Head>`.

#### Google tags
- `nositelinkssearchbox` -> do not show site-specific Google search box;
- `notranslate` -> tell Google not to provide a translation for this page;

#### Canonical tags
`<link rel="canonical" href="blabla.com>"` -> use it when there are multiple links pointing to the same page / information;

## Rendering
- SSG (static site generation) = HTML is generated at build time, best for SEO;
- SSR (server-side rendering) = HTML generated at request time, dynamic pages, good for SEO;
- ISR (incremental static regeneration) = only generate some pages statically;
- CSR (client side rendering) = website entirely rendered in the browser with JS, not recommended for SEO; good for dashboards, account pages, etc.;

## URL structure
- Semantic
- Logical patterns + consistent
- Keyword focused
- Not parameter based

## Metadata
- Title -> most important for SEO (what the page is about);
- Description -> not important for Google SEO;
- Open Graph tags -> good for when links are shared!! sets title, description, image in the link to the page;
- JSON-LD = JSON + extra context as defined in `schema.org`;
```json
  {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mihai",
  "url": "https://example.com"
}
```

## On page SEO
- Headings: what the page is about (d'oh)
- Internal links (blog can be a hub, a resource to other resources); use `next/link`;

## Web vitals
https://web.dev/articles/vitals
Would be useful to benchmark your website - good feedback.
Already went over those in another Next optimisation tutorial, but in short:
- LCP = time for the largest element to become visible;
- FID = first input delay;
- CLS = cumulative layout shift
Use Lighthouse, basically: https://developer.chrome.com/docs/lighthouse/overview/

