
import React, { useState } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { MessagesHeader } from "@/components/messages/MessagesHeader";
import { ConversationsList } from "@/components/messages/ConversationsList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { NewConversationDialog } from "@/components/messages/NewConversationDialog";
import { useMessages } from "@/hooks/useMessages";
import { useUsers } from "@/hooks/useUsers";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);

  const { data: conversations, isLoading } = useMessages();
  const { data: users } = useUsers();

  const filteredConversations = conversations?.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const handleNewConversation = () => {
    setIsNewConversationOpen(true);
  };

  const handleConversationCreated = (newConversation) => {
    setSelectedConversation(newConversation);
    setIsNewConversationOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 h-full">
        <MessagesHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewConversation={handleNewConversation}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 h-[calc(100vh-220px)]">
          <div className="lg:col-span-4">
            <ConversationsList
              conversations={filteredConversations}
              isLoading={isLoading}
              selectedId={selectedConversation?.id}
              onConversationClick={setSelectedConversation}
            />
          </div>
          
          <div className="lg:col-span-8">
            {selectedConversation ? (
              <ChatWindow 
                conversation={selectedConversation}
                onClose={() => setSelectedConversation(null)}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/60 shadow-sm">
                <div className="text-center px-8 py-12">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome to Team Chat</h3>
                  <p className="text-gray-500 mb-6 leading-relaxed max-w-sm">
                    Select a conversation from the sidebar to start messaging with your team members about maintenance tasks and projects.
                  </p>
                  <button 
                    onClick={handleNewConversation}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Start New Conversation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <NewConversationDialog
          isOpen={isNewConversationOpen}
          onClose={() => setIsNewConversationOpen(false)}
          onConversationCreated={handleConversationCreated}
          users={users || []}
        />
      </div>
    </DashboardLayout>
  );
};

export default Messages;
