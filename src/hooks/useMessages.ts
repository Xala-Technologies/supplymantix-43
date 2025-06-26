
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const mockConversations = [
  {
    id: "1",
    title: "Pump Maintenance Discussion",
    participants: [
      { id: "1", name: "John Smith", avatar: null },
      { id: "2", name: "Sarah Johnson", avatar: null }
    ],
    lastMessage: {
      text: "The replacement parts should arrive tomorrow",
      timestamp: "2024-06-05T14:30:00Z",
      sender: "Sarah Johnson"
    },
    unread: 2,
    workOrderId: "WO-2024-001"
  },
  {
    id: "2",
    title: "HVAC System Check",
    participants: [
      { id: "3", name: "Mike Wilson", avatar: null },
      { id: "4", name: "Lisa Chen", avatar: null }
    ],
    lastMessage: {
      text: "Temperature readings look normal now",
      timestamp: "2024-06-05T13:15:00Z",
      sender: "Mike Wilson"
    },
    unread: 0,
    workOrderId: "WO-2024-002"
  },
  {
    id: "3",
    title: "General Maintenance Team",
    participants: [
      { id: "1", name: "John Smith", avatar: null },
      { id: "2", name: "Sarah Johnson", avatar: null },
      { id: "3", name: "Mike Wilson", avatar: null },
      { id: "5", name: "Emma Davis", avatar: null }
    ],
    lastMessage: {
      text: "Weekly team meeting scheduled for Friday at 2 PM",
      timestamp: "2024-06-04T16:20:00Z",
      sender: "John Smith"
    },
    unread: 1
  },
  {
    id: "4",
    title: "Equipment Upgrade Project",
    participants: [
      { id: "2", name: "Sarah Johnson", avatar: null },
      { id: "6", name: "Robert Kim", avatar: null }
    ],
    lastMessage: {
      text: "Budget approval received. Let's proceed with the installation next week.",
      timestamp: "2024-06-03T11:45:00Z",
      sender: "Robert Kim"
    },
    unread: 0
  }
];

export const useMessages = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockConversations;
    },
    staleTime: 30000, // 30 seconds
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (conversationData: any) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newConversation = {
        id: Date.now().toString(),
        title: conversationData.title,
        participants: conversationData.participantIds.slice(0, 3).map((id: string, index: number) => ({
          id,
          name: `User ${id}`,
          avatar: null
        })),
        lastMessage: {
          text: "Conversation started",
          timestamp: new Date().toISOString(),
          sender: "System"
        },
        unread: 0
      };
      
      return newConversation;
    },
    onSuccess: (newConversation) => {
      queryClient.setQueryData(["messages"], (old: any) => {
        return old ? [newConversation, ...old] : [newConversation];
      });
      toast.success('Conversation created successfully');
    },
    onError: () => {
      toast.error('Failed to create conversation');
    }
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (messageData: { conversationId: string; content: string }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { 
        id: Date.now().toString(), 
        timestamp: new Date().toISOString(),
        ...messageData 
      };
    },
    onSuccess: (data) => {
      // Update the conversation's last message
      queryClient.setQueryData(["messages"], (conversations: any) => {
        return conversations?.map((conv: any) => 
          conv.id === data.conversationId 
            ? {
                ...conv,
                lastMessage: {
                  text: data.content,
                  timestamp: data.timestamp,
                  sender: "You"
                }
              }
            : conv
        );
      });
    },
    onError: () => {
      toast.error('Failed to send message');
    }
  });
};
