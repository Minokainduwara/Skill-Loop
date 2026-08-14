import { useState, useRef, useEffect, useMemo } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { PageProps } from '../types'
import { Avatar, Badge, Btn, C, Card, EmptyState, Input, PageHead, SearchInput, Shell } from '../components/ui'
import type { Id } from '../../convex/_generated/dataModel'

export default function Messages({ onNavigate, data }: PageProps) {
  const channels = useQuery(api.messages.listChannels, {})
  const user = useQuery(api.users.current)
  
  const [activeChannelId, setActiveChannelId] = useState<Id<"channels"> | null>(
    data?.channelId as Id<"channels"> || null
  )
  const [query, setQuery] = useState('')
  
  useEffect(() => {
    if (!activeChannelId && channels && channels.length > 0) {
      setActiveChannelId(channels[0]._id)
    }
  }, [channels, activeChannelId])

  const filteredChannels = useMemo(() => {
    if (!channels) return []
    const q = query.trim().toLowerCase()
    if (!q) return channels
    return channels.filter(
      (c) => 
        (c.otherUser?.username || "").toLowerCase().includes(q) || 
        (c.jobRequest?.title || "").toLowerCase().includes(q)
    )
  }, [channels, query])

  const activeChannel = channels?.find((c) => c._id === activeChannelId)

  return (
    <Shell width={1240}>
      <style>{`
        .sl-msg-grid { display: grid; grid-template-columns: 340px 1fr; gap: 18px; align-items: start }
        @media (max-width: 880px) {
          .sl-msg-grid { grid-template-columns: 1fr }
          .sl-msg-list { max-height: 320px }
        }
      `}</style>

      <PageHead
        eyebrow="Inbox"
        title="Messages"
        subtitle="Every conversation tied to a job, in one place."
        actions={
          <Btn variant="secondary" onClick={() => onNavigate('my-jobs')}>
            My jobs
          </Btn>
        }
      />

      {channels === undefined ? (
        <Card>Loading messages...</Card>
      ) : channels.length === 0 ? (
        <EmptyState 
          emoji="💬" 
          title="No active conversations" 
          text="When you apply to an opportunity, your chat with the requester will appear here." 
        />
      ) : (
        <div className="sl-msg-grid">
          {/* Sidebar */}
          <Card pad={0} style={{ overflow: 'hidden' }}>
            <div style={{ padding: 14, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
              <SearchInput value={query} onChange={setQuery} placeholder="Search conversations" />
            </div>
            <div className="sl-msg-list scrollbar-hide" style={{ maxHeight: 560, overflowY: 'auto' }}>
              {filteredChannels.length === 0 && (
                <p style={{ padding: 24, margin: 0, fontSize: 13, color: C.faint, textAlign: 'center' }}>
                  No conversations match "{query}".
                </p>
              )}
              {filteredChannels.map((c) => {
                const on = c._id === activeChannelId
                return (
                  <button
                    key={c._id}
                    onClick={() => setActiveChannelId(c._id)}
                    className="sl-press"
                    style={{
                      display: 'flex',
                      gap: 12,
                      width: '100%',
                      textAlign: 'left',
                      padding: '14px 16px',
                      border: 'none',
                      borderLeft: `3px solid ${on ? C.primary : 'transparent'}`,
                      borderBottom: `1px solid ${C.subtle}`,
                      background: on ? '#EEF2FF' : C.surface,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <Avatar name={c.otherUser?.username || "User"} size={42} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <span
                          style={{
                            fontSize: 13.5,
                            fontWeight: 800,
                            color: C.text,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {c.otherUser?.username || "User"}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginTop: 5,
                        }}
                      >
                        <span
                          style={{
                            flex: 1,
                            minWidth: 0,
                            fontSize: 12.5,
                            color: C.muted,
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {c.jobRequest?.title || "Unknown Job"}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Main Chat Area */}
          <Card pad={0} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {activeChannel ? (
              <ChatWindow channelId={activeChannel._id} otherUser={activeChannel.otherUser} jobRequest={activeChannel.jobRequest} currentUser={user} onNavigate={onNavigate} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360, color: C.muted }}>
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      )}
    </Shell>
  )
}

function ChatWindow({ channelId, otherUser, jobRequest, currentUser, onNavigate }: any) {
  const messages = useQuery(api.messages.listMessages, { channelId })
  const sendMessage = useMutation(api.messages.sendMessage)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = draft.trim()
    if (!text) return
    await sendMessage({ channelId, text })
    setDraft('')
  }

  return (
    <>
      <div
        style={{
          padding: '15px 20px',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <Avatar name={otherUser?.username || "User"} size={40} />
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: C.text }}>{otherUser?.username || "User"}</div>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: C.success,
              marginTop: 2,
            }}
          >
            ● Online now
          </div>
        </div>
        <Badge color={C.accent}>{jobRequest?.title || "Unknown Job"}</Badge>
        <Btn size="sm" variant="secondary" onClick={() => onNavigate('opportunity-detail', { jobRequestId: jobRequest?._id })}>
          View job
        </Btn>
      </div>

      <div
        className="scrollbar-hide"
        style={{
          padding: 20,
          minHeight: 360,
          maxHeight: 480,
          overflowY: 'auto',
          display: 'grid',
          gap: 12,
          alignContent: (messages && messages.length) ? 'start' : 'center',
          background: C.bg,
        }}
      >
        {messages === undefined ? (
          <div style={{ textAlign: 'center', color: C.muted, marginTop: 20 }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <EmptyState
            emoji="💬"
            title="No messages yet"
            text={`Start the conversation with ${otherUser?.username || "them"} — a short intro doubles your reply rate.`}
            action={<Btn size="sm" onClick={() => setDraft('Hi! I am interested in this opportunity.')}>Draft a hello</Btn>}
          />
        ) : (
          messages.map((m) => {
            const mine = m.senderId === currentUser?._id
            return (
              <div key={m._id} style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '72%' }}>
                    <div
                      style={{
                        padding: '11px 15px',
                        borderRadius: 16,
                        borderBottomRightRadius: mine ? 5 : 16,
                        borderBottomLeftRadius: mine ? 16 : 5,
                        fontSize: 13.5,
                        lineHeight: 1.6,
                        background: mine
                          ? 'linear-gradient(135deg, #4F46E5, #6D5AE6)'
                          : C.surface,
                        color: mine ? '#fff' : C.text,
                        border: mine ? 'none' : `1px solid ${C.border}`,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {m.text}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: C.faint,
                        marginTop: 5,
                        textAlign: mine ? 'right' : 'left',
                      }}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          padding: 14,
          borderTop: `1px solid ${C.border}`,
          alignItems: 'center',
        }}
      >
        <button
          className="sl-press"
          aria-label="Attach a file"
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            background: C.surface,
            cursor: 'pointer',
            fontSize: 17,
            flexShrink: 0,
            fontFamily: 'inherit',
          }}
        >
          📎
        </button>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send()
          }}
          placeholder={`Message ${otherUser?.username?.split(' ')[0] || "them"}…`}
        />
        <Btn onClick={send} disabled={!draft.trim()}>Send</Btn>
      </div>
    </>
  )
}
