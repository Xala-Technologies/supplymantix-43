
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
      { id: "3", name: "Mike Wilson", avatar: null }
    ],
    lastMessage: {
      text: "Weekly team meeting scheduled for Friday",
      timestamp: "2024-06-04T16:20:00Z",
      sender: "John Smith"
    },
    unread: 1
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
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...conversationData, id: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
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
    mutationFn: async (messageData: any) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      return { ...messageData, id: Date.now().toString(), timestamp: new Date().toISOString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => {
      toast.error('Failed to send message');
    }
  });
};
