export const checkOrder = (userId: string, recipientId: string) => {
    const order = [userId, recipientId].sort();
    return order;
  };

  export const getChatRoomId = (userId: string, recipientId: string) => {
    const order = checkOrder(userId, recipientId);
    const chatRoomId = "chat_" + order[0] + "_" + order[1];
    return chatRoomId;
  };