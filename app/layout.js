import './globals.css'
import { Providers } from './providers'
import { ClerkProvider } from '@clerk/nextjs'

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export const metadata = {
  title: 'Perspective Machine — Multi-Lens AI Analysis',
  description: 'Spin the dial. See your idea through 8 minds and 4 synthesis engines.',
}

export default function RootLayout({ children }) {
  const tree = (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
  return clerkEnabled ? <ClerkProvider>{tree}</ClerkProvider> : tree
}
