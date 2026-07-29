import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  vi,
} from "vitest";
import { IDLE_RECORDING_STATE } from "../types/recording";

const sendMessageMock = vi.fn();
const addStorageListenerMock = vi.fn();
const removeStorageListenerMock = vi.fn();

Object.defineProperty(globalThis, "chrome", {
  configurable: true,
  value: {
    runtime: {
      sendMessage: sendMessageMock,
    },
    storage: {
      onChanged: {
        addListener: addStorageListenerMock,
        removeListener: removeStorageListenerMock,
      },
    },
  },
});

beforeEach(() => {
  sendMessageMock.mockImplementation(
    async (message: { type?: string }) => {
      if (message.type === "GET_RECORDING_STATE") {
        return {
          ok: true,
          state: {
            ...IDLE_RECORDING_STATE,
          },
        };
      }

      return {
        ok: true,
      };
    },
  );
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});