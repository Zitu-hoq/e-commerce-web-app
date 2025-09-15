// store/reduxPersistStorage.js
const isServer = typeof window === "undefined";

const storage = isServer
  ? {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    }
  : require("redux-persist/lib/storage").default;

export default storage;
