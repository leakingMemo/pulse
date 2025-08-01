export const environment = {
  isDevelopment: true,
  textSize: "medium",
  theme: "dark",
  launchType: "userInitiated",
  commandMode: "view",
  commandName: "test",
  extensionName: "test",
  supportPath: "",
  assetsPath: "",
};

export const getPreferenceValues = () => ({});

export const LocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

export const showToast = jest.fn();
export const showHUD = jest.fn();
export const popToRoot = jest.fn();
export const closeMainWindow = jest.fn();
