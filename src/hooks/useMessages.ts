
import { useQuery } from "@tanstack/react-query";

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
  }
];

export const useMessages = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockConversations;
    },
  });
};
