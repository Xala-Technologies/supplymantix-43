
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
      <div className="space-y-6 h-full">
        <MessagesHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewConversation={handleNewConversation}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          <div className="lg:col-span-1">
            <ConversationsList
              conversations={filteredConversations}
              isLoading={isLoading}
              selectedId={selectedConversation?.id}
              onConversationClick={setSelectedConversation}
            />
          </div>
          
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <ChatWindow 
                conversation={selectedConversation}
                onClose={() => setSelectedConversation(null)}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500 mb-4">Choose a conversation from the list to start messaging</p>
                  <button 
                    onClick={handleNewConversation}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
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
