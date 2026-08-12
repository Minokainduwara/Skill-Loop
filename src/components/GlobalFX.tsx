export function GlobalFX() {
  return (
    <style>{`
      @keyframes sl-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
      @keyframes sl-pulse-ring {
        0% { transform: scale(0.35); opacity: 0.85 }
        100% { transform: scale(1); opacity: 0 }
      }
      @keyframes sl-blip { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.5); opacity: 0.55 } }
      @keyframes sl-sweep { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      @keyframes sl-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
      @keyframes sl-pop { 0% { transform: scale(0.7); opacity: 0 } 60% { transform: scale(1.08) } 100% { transform: scale(1); opacity: 1 } }
      @keyframes sl-shimmer { from { background-position: 200% 0 } to { background-position: -200% 0 } }
      @keyframes sl-confetti { 0% { transform: translateY(-10px) rotate(0); opacity: 1 } 100% { transform: translateY(420px) rotate(540deg); opacity: 0 } }
      @keyframes sl-grow-x { from { transform: scaleX(0) } to { transform: scaleX(1) } }
      @keyframes sl-spin { to { transform: rotate(360deg) } }

      .sl-rise { animation: sl-rise .5s cubic-bezier(.22,1,.36,1) both }
      .sl-hover { transition: transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s ease, border-color .22s ease }
      .sl-hover:hover { transform: translateY(-3px); box-shadow: 0 18px 40px rgba(15,23,42,0.10); border-color: #C7D2FE }
      .sl-press { transition: transform .12s ease, box-shadow .2s ease, background .2s ease, color .2s ease, border-color .2s ease }
      .sl-press:hover { filter: brightness(1.05) }
      .sl-press:active { transform: translateY(1px) scale(.995) }
      .sl-link { transition: color .18s ease, background .18s ease }
      input:focus-visible, textarea:focus-visible, select:focus-visible, button:focus-visible, a:focus-visible {
        outline: 2px solid #4F46E5; outline-offset: 2px;
      }
      .sl-input { transition: border-color .18s ease, box-shadow .18s ease, background .18s ease }
      .sl-input:focus { border-color: #4F46E5; box-shadow: 0 0 0 4px rgba(79,70,229,0.12); outline: none }
    `}</style>
  )
}
