export type ForgeAppContext = {
  moduleKey: string;
  accountId?: string;
  cloudId?: string;
  siteUrl: string;
  extension: {
    space?: {
      id?: string;
      key?: string;
    };
  };
};
