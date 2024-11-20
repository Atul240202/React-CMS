import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAP5PHGZzfwWmpokGKo3CZOJVLo-r0w4Zg',
  authDomain: 'go-productions.firebaseapp.com',
  databaseURL: 'https://go-productions-default-rtdb.firebaseio.com',
  projectId: 'go-productions',
  storageBucket: 'go-productions.firebasestorage.app',
  messagingSenderId: '518642601161',
  appId: '1:518642601161:web:8bae0f4dcd0f5ec76dd118',
  measurementId: 'G-WV6RVR1TZV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Code for Still related logic for connecting with Firebase

export async function uploadMotion(clientId, motionData, videoFile) {
  try {
    // Upload video
    const videoRef = ref(storage, `motions/${clientId}/${Date.now()}`);
    await uploadBytes(videoRef, videoFile);
    const videoUrl = await getDownloadURL(videoRef);

    // Get client data
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);

    if (clientDoc.exists()) {
      const clientData = clientDoc.data();

      // Prepare motion data
      const motionDoc = {
        ...motionData,
        video: videoUrl,
        logo: clientData.image || '', // Use the client's image as the logo
        clientId: clientId,
      };

      // Add motion to client document
      const updatedMotions = clientData.motions
        ? [...clientData.motions, motionDoc]
        : [motionDoc];

      await updateDoc(clientRef, { motions: updatedMotions });
      return { id: clientId, ...motionDoc };
    } else {
      throw new Error('Client not found');
    }
  } catch (error) {
    console.error('Error uploading motion:', error);
    throw error;
  }
}

export async function getMotions() {
  try {
    const clientsSnapshot = await getDocs(collection(db, 'clients'));
    let allMotions = [];
    clientsSnapshot.forEach((doc) => {
      const clientData = doc.data();
      if (clientData.motions) {
        allMotions = [
          ...allMotions,
          ...clientData.motions.map((motion) => ({
            ...motion,
            clientId: doc.id,
            clientName: clientData.name,
          })),
        ];
      }
    });
    return allMotions;
  } catch (error) {
    console.error('Error getting motions:', error);
    throw error;
  }
}

export async function updateMotion(
  clientId,
  motionId,
  updatedData,
  newVideoFile
) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);

    if (clientDoc.exists()) {
      const clientData = clientDoc.data();
      const motionIndex = clientData.motions.findIndex(
        (m) => m.id === motionId
      );

      if (motionIndex !== -1) {
        let updatedMotion = {
          ...clientData.motions[motionIndex],
          ...updatedData,
        };

        if (newVideoFile) {
          const videoRef = ref(storage, `motions/${clientId}/${Date.now()}`);
          await uploadBytes(videoRef, newVideoFile);
          updatedMotion.video = await getDownloadURL(videoRef);
        }

        const updatedMotions = [...clientData.motions];
        updatedMotions[motionIndex] = updatedMotion;

        await updateDoc(clientRef, { motions: updatedMotions });

        return { id: motionId, ...updatedMotion };
      } else {
        throw new Error('Motion not found');
      }
    } else {
      throw new Error('Client not found');
    }
  } catch (error) {
    console.error('Error updating motion:', error);
    throw error;
  }
}

export async function deleteMotion(clientId, motionIndex) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);

    if (clientDoc.exists()) {
      const clientData = clientDoc.data();
      if (motionIndex >= 0 && motionIndex < clientData.motions.length) {
        const motionToDelete = clientData.motions[motionIndex];

        // Delete video from Storage if it's a Firebase Storage URL
        if (
          motionToDelete.video &&
          motionToDelete.video.startsWith(
            'https://firebasestorage.googleapis.com'
          )
        ) {
          const videoRef = ref(storage, motionToDelete.video);
          await deleteObject(videoRef);
        }

        const updatedMotions = [
          ...clientData.motions.slice(0, motionIndex),
          ...clientData.motions.slice(motionIndex + 1),
        ];
        await updateDoc(clientRef, { motions: updatedMotions });
      } else {
        throw new Error('Motion index out of range');
      }
    } else {
      throw new Error('Client not found');
    }
  } catch (error) {
    console.error('Error deleting motion:', error);
    throw error;
  }
}

//rest of thee code for still, location & clients

export { db, storage };
