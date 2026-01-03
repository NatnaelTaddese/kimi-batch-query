"use client";

import { ModeToggle } from "@/components/mode-toggle";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  type PromptInputMessage,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { Loader } from "@/components/ai-elements/loader";
import {
  MessageSquare,
  PaperclipIcon,
  ArrowUpIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useSession, authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

// Custom attachment button component
function AttachmentButton() {
  const attachments = usePromptInputAttachments();

  return (
    <PromptInputButton
      type="button"
      onClick={() => attachments.openFileDialog()}
    >
      <PaperclipIcon className="size-4" />
    </PromptInputButton>
  );
}

export default function Page() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const { data: session } = useSession();
  const router = useRouter();

  const isAnonymous = !session || session?.user?.isAnonymous;
  const userName = session?.user?.name || session?.user?.email || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage({
      text: message.text || "Sent with attachments",
      files: message.files,
    });
    setInput("");
  };

  return (
    <div className="relative h-screen w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-3 border-b">
        <div className="flex items-center justify-between w-full max-w-4xl">
          <h1 className="text-xl font-semibold">Kimi K2 Chat</h1>
          <div className="flex items-center gap-3">
            <ModeToggle />
            {isAnonymous ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.image || undefined} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="min-w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || undefined} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{userName}</p>
                      {session?.user?.email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="size-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                  >
                    <LogOut className="size-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl h-full flex flex-col px-4">
            <Conversation className="flex-1">
              <ConversationContent>
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    icon={<MessageSquare className="size-12" />}
                    title="Start a conversation with Kimi K2"
                    description="Ask me anything! I'm powered by Moonshot AI's Kimi K2 model."
                  />
                ) : (
                  <>
                    {messages.map((message) => (
                      <Message from={message.role} key={message.id}>
                        <MessageContent>
                          {message.parts.map((part, i) => {
                            switch (part.type) {
                              case "text":
                                return (
                                  <MessageResponse key={`${message.id}-${i}`}>
                                    {part.text}
                                  </MessageResponse>
                                );
                              case "file":
                                if (part.mediaType?.startsWith("image/")) {
                                  return (
                                    <img
                                      key={`${message.id}-${i}`}
                                      src={part.url}
                                      alt={part.filename || "Attachment"}
                                      className="max-w-sm rounded-lg"
                                    />
                                  );
                                }
                                return (
                                  <div
                                    key={`${message.id}-${i}`}
                                    className="text-sm text-muted-foreground"
                                  >
                                    📎 {part.filename}
                                  </div>
                                );
                              default:
                                return null;
                            }
                          })}
                        </MessageContent>
                      </Message>
                    ))}
                    {status === "submitted" && <Loader />}
                  </>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            {/* Input Area */}
            <div className="py-4">
              <PromptInput onSubmit={handleSubmit} globalDrop multiple>
                <PromptInputHeader>
                  <PromptInputAttachments>
                    {(attachment) => (
                      <PromptInputAttachment data={attachment} />
                    )}
                  </PromptInputAttachments>
                </PromptInputHeader>
                <PromptInputBody>
                  <PromptInputTextarea
                    value={input}
                    placeholder="Message Kimi K2..."
                    onChange={(e) => setInput(e.currentTarget.value)}
                    className="min-h-15 resize-none"
                  />
                </PromptInputBody>
                <PromptInputFooter>
                  <PromptInputTools>
                    <AttachmentButton />
                  </PromptInputTools>
                  <PromptInputSubmit
                    status={status === "streaming" ? "streaming" : "ready"}
                    disabled={status === "streaming"}
                  >
                    <ArrowUpIcon className="size-4" />
                  </PromptInputSubmit>
                </PromptInputFooter>
              </PromptInput>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
