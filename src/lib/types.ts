// message body type
export type Message = {
  content: string;
  userId: number;
  chatId: number;
};

// user body type
export type User = {
  username: string;
  email: string;
  password: string;
};

export type Chat = {
  title: string;
  userId: number;
  thing?: string;

}