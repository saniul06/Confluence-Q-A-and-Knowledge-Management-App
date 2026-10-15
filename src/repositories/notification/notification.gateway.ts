export interface NotificationGateway {
  notifyAssignedExpert(input: {
    questionId: string;
    questionTitle: string;
    expertAccountId: string;
    spaceKey: string;
  }): Promise<void>;
}


