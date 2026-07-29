const DATABASE_NAME = "recordock";
const DATABASE_VERSION = 1;
const RECORDINGS_STORE = "recordings";
const LATEST_RECORDING_ID = "latest";

export interface StoredRecording {
  id: string;
  blob: Blob;
  filename: string;
  mimeType: string;
  fileSizeBytes: number;
  createdAt: number;
}

interface SaveRecordingInput {
  blob: Blob;
  filename: string;
  mimeType: string;
  fileSizeBytes: number;
  createdAt: number;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DATABASE_NAME,
      DATABASE_VERSION,
    );

    request.onupgradeneeded = () => {
      const database = request.result;

      if (
        !database.objectStoreNames.contains(
          RECORDINGS_STORE,
        )
      ) {
        database.createObjectStore(RECORDINGS_STORE, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(
        request.error ??
          new Error(
            "Recordock could not open recording storage.",
          ),
      );
    };
  });
}

export async function saveLatestRecording(
  recording: SaveRecordingInput,
): Promise<void> {
  const database = await openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        RECORDINGS_STORE,
        "readwrite",
      );

      const store = transaction.objectStore(
        RECORDINGS_STORE,
      );

      store.put({
        id: LATEST_RECORDING_ID,
        ...recording,
      } satisfies StoredRecording);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ??
            new Error(
              "Recordock could not save the recording.",
            ),
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ??
            new Error(
              "Saving the recording was interrupted.",
            ),
        );
      };
    });
  } finally {
    database.close();
  }
}

export async function getLatestRecording(): Promise<
  StoredRecording | null
> {
  const database = await openDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(
        RECORDINGS_STORE,
        "readonly",
      );

      const store = transaction.objectStore(
        RECORDINGS_STORE,
      );

      const request = store.get(LATEST_RECORDING_ID);

      request.onsuccess = () => {
        resolve(
          (request.result as StoredRecording | undefined) ??
            null,
        );
      };

      request.onerror = () => {
        reject(
          request.error ??
            new Error(
              "Recordock could not retrieve the recording.",
            ),
        );
      };
    });
  } finally {
    database.close();
  }
}

export async function deleteLatestRecording(): Promise<void> {
  const database = await openDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        RECORDINGS_STORE,
        "readwrite",
      );

      transaction
        .objectStore(RECORDINGS_STORE)
        .delete(LATEST_RECORDING_ID);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ??
            new Error(
              "Recordock could not remove the recording.",
            ),
        );
      };
    });
  } finally {
    database.close();
  }
}