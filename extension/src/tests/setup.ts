import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  vi,
} from "vitest";

const addStorageListenerMock = vi.fn();
const removeStorageListenerMock = vi.fn();
const createWindowMock = vi.fn();

Object.defineProperty(globalThis, "chrome", {
  configurable: true,
  value: {
    runtime: {
      sendMessage: vi.fn(),
      getURL: vi.fn(
        (path: string) =>
          `chrome-extension://recordock/${path}`,
      ),
    },

    storage: {
      onChanged: {
        addListener: addStorageListenerMock,
        removeListener: removeStorageListenerMock,
      },
    },

    windows: {
      create: createWindowMock,
    },
  },
});

Object.defineProperty(URL, "createObjectURL", {
  configurable: true,
  writable: true,
  value: vi.fn(() => "blob:recordock-preview"),
});

Object.defineProperty(URL, "revokeObjectURL", {
  configurable: true,
  writable: true,
  value: vi.fn(),
});

beforeEach(() => {
  createWindowMock.mockResolvedValue({
    id: 1,
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.useRealTimers();
});