'use client'

import { Show, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'

// Rendered only when Clerk is configured (publishable key present).
export default function AuthControls() {
  return (
    <div className="flex items-center gap-2">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="font-mono-c text-[10px] tracking-wide px-3 py-1.5 rounded-full border pm-line hover:bg-[#F1E84A] transition-colors" style={{ background: '#F7FBF1' }}>
            SIGN IN
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="font-mono-c text-[10px] tracking-wide px-3 py-1.5 rounded-full border pm-line hover:bg-[#F1E84A] transition-colors" style={{ background: '#CBA9F0' }}>
            SIGN UP
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <div className="w-8 h-8 rounded-full border pm-line flex items-center justify-center overflow-hidden" style={{ background: '#F7FBF1' }}>
          <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-7 h-7' } }} />
        </div>
      </Show>
    </div>
  )
}
