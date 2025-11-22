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
- Manually: You wrap things in Suspense, fallback = Skeleton for each component.





