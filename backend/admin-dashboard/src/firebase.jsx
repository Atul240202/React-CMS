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
  writeBatch,
  orderBy,
  limit,
  arrayUnion,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updateProfile,
} from 'firebase/auth';

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth };

export const uploadProfileImage = async (userId, file) => {
  try {
    const imageRef = ref(storage, `profileImages/${userId}`);
    await uploadBytes(imageRef, file);
    const photoURL = await getDownloadURL(imageRef);
    return photoURL;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (name, email, password, profileImage) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Upload profile image if provided
    let photoURL = null;
    if (profileImage) {
      photoURL = await uploadProfileImage(user.uid, profileImage);
    }

    // Update user's profile with name and photo URL
    await updateProfile(user, {
      displayName: name,
      photoURL,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

//login
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

//logout
export const logout = async () => {
  try {
    await signOut(auth); // Correct function to sign out
  } catch (error) {
    throw error;
  }
};

// Send password reset email
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};

// Verify password reset code
export const verifyResetCode = async (code) => {
  try {
    await verifyPasswordResetCode(auth, code);
    return true;
  } catch (error) {
    throw error;
  }
};

// Complete password reset
export const confirmReset = async (code, newPassword) => {
  try {
    await confirmPasswordReset(auth, code, newPassword);
    return true;
  } catch (error) {
    throw error;
  }
};
// Utility function to upload a client
export async function uploadClient(name, clientKey, file, fileType) {
  try {
    // Get file extension and generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${clientKey}_${Date.now()}.${fileExtension}`;
    // Upload image to Firebase Storage with metadata
    const storageRef = ref(storage, `clients/${uniqueFileName}`);
    const metadata = {
      contentType: fileType,
    };
    await uploadBytes(storageRef, file, metadata);
    const imageUrl = await getDownloadURL(storageRef);

    // Add client data to Firestore
    const clientData = {
      name,
      image: imageUrl,
      clientKey,
      fileType: fileType,
      fileName: uniqueFileName,
      sequence: Date.now(), // Add a default sequence value
    };
    const docRef = await addDoc(collection(db, 'clients'), clientData);

    return { id: docRef.id, ...clientData };
  } catch (error) {
    console.error('Error uploading client:', error);
    throw error;
  }
}
// Utility function to get all clients
export async function getClients() {
  try {
    const clientsSnapshot = await getDocs(collection(db, 'clients'));
    return clientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      sequence: doc.data().sequence || Math.floor(0), // Assign 0 sequence if not available
    }));
  } catch (error) {
    console.error('Error getting clients:', error);
    throw error;
  }
}

export async function updateClientSequence(updates) {
  const batch = writeBatch(db);

  updates.forEach(({ id, sequence }) => {
    const clientRef = doc(db, 'clients', id);
    batch.update(clientRef, { sequence });
  });

  try {
    await batch.commit();
  } catch (error) {
    console.error('Error updating client sequences:', error);
    throw error;
  }
}

// Utility function to delete a client
export async function deleteClient(clientId, imagePath) {
  try {
    // Delete client document from Firestore
    await deleteDoc(doc(db, 'clients', clientId));

    // Delete image from Firebase Storage
    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}

// Utility function to update a client
export async function updateClient(clientId, updatedData, newFile = null) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    let imageUrl = updatedData.image;

    if (newFile) {
      // Upload new image to Firebase Storage
      const storageRef = ref(storage, `clients/${updatedData.name}`);
      await uploadBytes(storageRef, newFile);
      imageUrl = await getDownloadURL(storageRef);

      // Delete old image if it exists
      if (updatedData.image) {
        const oldImageRef = ref(storage, updatedData.image);
        await deleteObject(oldImageRef);
      }
    }

    // Update client data in Firestore
    await updateDoc(clientRef, { ...updatedData, image: imageUrl });

    return { id: clientId, ...updatedData, image: imageUrl };
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

// Utility function to get a single client
export async function getClient(clientId) {
  try {
    const clientDoc = await getDoc(doc(db, 'clients', clientId));
    if (clientDoc.exists()) {
      return { id: clientDoc.id, ...clientDoc.data() };
    } else {
      throw new Error('Client not found');
    }
  } catch (error) {
    console.error('Error getting client:', error);
    throw error;
  }
}

export async function getClientLogo(clientId) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);

    if (clientDoc.exists()) {
      const clientData = clientDoc.data();
      return clientData.image || clientData.logo || ''; // Change 'logo' to 'image' to match the data structure
    } else {
      throw new Error('Client not found');
    }
  } catch (error) {
    console.error('Error getting client logo:', error);
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
            sequence: motion.sequence || 0, // Default to 0 if sequence is not available
          })),
        ];
      }
    });
    return allMotions.sort((a, b) => a.sequence - b.sequence);
  } catch (error) {
    console.error('Error getting motions:', error);
    throw error;
  }
}

export async function updateMotionSequence(updates) {
  const batch = writeBatch(db);

  updates.forEach(({ id, clientId, sequence }) => {
    const clientRef = doc(db, 'clients', clientId);
    batch.update(clientRef, {
      motions: arrayUnion({ id, sequence }),
    });
  });

  try {
    await batch.commit();
  } catch (error) {
    console.error('Error updating motion sequences:', error);
    throw error;
  }
}

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

      // Set all credit fields to be visible by default
      const visibleFields = {};
      for (const creditKey in motionData.credits) {
        visibleFields[`credits.${creditKey}`] = true;
      }

      // Prepare motion data
      const motionId = Date.now().toString();
      const motionDoc = {
        id: motionId,
        ...motionData,
        video: videoUrl,
        logo: clientData.image || '', // Use the client's image as the logo
        clientId: clientId,
        filter: motionData.filter || [],
        visibleFields: visibleFields,
      };

      // Add motion to client document
      const updatedMotions = clientData.motions
        ? [...clientData.motions, motionDoc]
        : [motionDoc];

      await updateDoc(clientRef, { motions: updatedMotions });
      return { id: motionId, ...motionDoc };
    } else {
      throw new Error('Client not found');
    }
  } catch (error) {
    console.error('Error uploading motion:', error);
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
          filter: updatedData.filter || [],
        };

        if (newVideoFile) {
          const videoRef = ref(
            storage,
            `motions/${clientId}/${Date.now()}_${updatedData.name}`
          );

          // Create file metadata including the content type
          const metadata = {
            contentType: updatedData.type,
          };

          // Upload the file and metadata
          await uploadBytes(videoRef, updatedData, metadata);
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

export async function deleteMotion(clientId, motionId) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);

    if (clientDoc.exists()) {
      const clientData = clientDoc.data();
      const motionIndex = clientData.motions.findIndex(
        (m) => m.id === motionId
      );

      if (motionIndex !== -1) {
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
        throw new Error('Motion not found');
      }
    } else {
      throw new Error('Client not found');
    }
  } catch (error) {
    console.error('Error deleting motion:', error);
    throw error;
  }
}

export async function getClientsByName() {
  try {
    const clientsSnapshot = await getDocs(collection(db, 'clients'));
    return clientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
  } catch (error) {
    console.error('Error getting clients:', error);
    throw error;
  }
}

// Code for Still related logic for connecting with Firebase

export async function getStills() {
  try {
    const clients = await getClients();
    const stills = [];

    for (const client of clients) {
      if (client.stills) {
        const clientStills = Object.entries(client.stills).map(
          ([id, still]) => ({
            id,
            clientId: client.id,
            ...still,
          })
        );
        stills.push(...clientStills);
      }
    }
    stills.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
    return stills;
  } catch (error) {
    console.error('Error getting stills:', error);
    throw error;
  }
}

export async function uploadImage(file, path) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function deleteStill(clientId, stillId) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);

    if (!clientDoc.exists()) {
      throw new Error('Client not found');
    }

    const updatedStills = { ...clientDoc.data().stills };
    delete updatedStills[stillId];

    await updateDoc(clientRef, { stills: updatedStills });

    // Delete the image from storage if it exists
    const storageRef = ref(storage, `stills/${clientId}/${stillId}`);
    try {
      await deleteObject(storageRef);
    } catch (error) {
      console.warn('Image not found in storage or already deleted');
    }
  } catch (error) {
    console.error('Error deleting still:', error);
    throw error;
  }
}

export async function updateStillDashboardSequence(updates) {
  const batch = writeBatch(db);
  updates.forEach(({ id, clientId, sequence }) => {
    const clientRef = doc(db, 'clients', clientId);
    batch.update(clientRef, {
      [`stills.${id}.sequence`]: sequence,
    });
  });

  try {
    await batch.commit();
  } catch (error) {
    console.error('Error updating still sequences:', error);
    throw error;
  }
}

export async function addStill(clientId, stillData, mainFile, gridFiles) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);

    if (!clientDoc.exists()) {
      throw new Error('Client not found');
    }

    let newStillData = { ...stillData };

    if (mainFile) {
      const mainImageUrl = await uploadImage(
        mainFile,
        `stills/${clientId}/main_${Date.now()}`
      );
      newStillData.image = mainImageUrl;
    }

    if (gridFiles && gridFiles.length > 0) {
      const internalImages = {};
      for (let i = 0; i < gridFiles.length; i++) {
        const gridImageUrl = await uploadImage(
          gridFiles[i],
          `stills/${clientId}/grid_${Date.now()}_${i}`
        );
        internalImages[`item${i + 1}`] = gridImageUrl;
      }
      newStillData.internalImages = internalImages;
    }

    const stillId = Date.now().toString();

    // Get the current highest sequence number
    const stills = await getStills();
    const maxSequence = stills.reduce(
      (max, still) => Math.max(max, still.sequence || 0),
      -1
    );

    newStillData.sequence = maxSequence + 1;

    // Include the filter field
    newStillData.filter = stillData.filter || [];

    // Set all credit fields to be visible by default
    const visibleFields = {};
    for (const creditKey in newStillData.credits) {
      visibleFields[`credits.${creditKey}`] = true;
    }
    newStillData.visibleFields = visibleFields;

    await updateDoc(clientRef, {
      [`stills.${stillId}`]: {
        ...newStillData,
        visibleFields: newStillData.visibleFields,
      },
    });

    return { id: stillId, clientId, ...newStillData };
  } catch (error) {
    console.error('Error adding still:', error);
    throw error;
  }
}

export async function updateStill(
  clientId,
  stillId,
  stillData,
  file,
  setUploadProgress
) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);

    if (!clientDoc.exists()) {
      throw new Error('Client not found');
    }

    let updatedStillData = { ...stillData };
    if (file) {
      const downloadURL = await uploadImage(
        file,
        `stills/${clientId}/${stillId}`
      );
      updatedStillData.image = downloadURL;
    }

    await updateDoc(clientRef, {
      [`stills.${stillId}`]: updatedStillData,
    });

    return { id: stillId, clientId, ...updatedStillData };
  } catch (error) {
    console.error('Error updating still:', error);
    throw error;
  }
}
// export async function getLocations() {
//   try {
//     const locationsSnapshot = await getDocs(collection(db, 'locations'));
//     return locationsSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//       sequence: doc.data().sequence || 0, // Assign 0 if sequence is not available
//     }));
//   } catch (error) {
//     console.error('Error getting locations:', error);
//     throw error;
//   }
// }

// export async function addLocation(locationData, mainFile, gridFiles) {
//   try {
//     // Handle main image upload
//     const mainImageUrl = await uploadImage(
//       mainFile,
//       `locations/main_${Date.now()}`
//     );

//     // Handle grid images upload
//     const gridImageUrls = {};
//     for (let i = 0; i < gridFiles.length; i++) {
//       const gridImageUrl = await uploadImage(
//         gridFiles[i],
//         `locations/grid_${Date.now()}_${i}`
//       );
//       gridImageUrls[`image${i + 1}`] = gridImageUrl;
//     }

//     const newLocationData = {
//       ...locationData,
//       image: mainImageUrl,
//       locationImages: gridImageUrls,
//       sequence: Date.now(), // Add a default sequence value
//     };

//     const docRef = await addDoc(collection(db, 'locations'), newLocationData);
//     return { id: docRef.id, ...newLocationData };
//   } catch (error) {
//     console.error('Error adding location:', error);
//     throw error;
//   }
// }
// export async function updateLocationSequence(updates) {
//   const batch = writeBatch(db);

//   updates.forEach(({ id, sequence }) => {
//     const locationRef = doc(db, 'locations', id);
//     batch.update(locationRef, { sequence });
//   });

//   try {
//     await batch.commit();
//   } catch (error) {
//     console.error('Error updating location sequences:', error);
//     throw error;
//   }
// }

// export async function updateLocation(
//   locationId,
//   locationData,
//   mainFile,
//   gridFiles
// ) {
//   try {
//     const locationRef = doc(db, 'locations', locationId);
//     let updatedLocationData = { ...locationData };

//     if (mainFile) {
//       const mainImageUrl = await uploadImage(
//         mainFile[0],
//         `locations/main_${locationId}_${Date.now()}`
//       );
//       updatedLocationData.image = mainImageUrl;
//     }

//     if (gridFiles && gridFiles.length > 0) {
//       const gridImageUrls = {};
//       for (let i = 0; i < gridFiles.length; i++) {
//         const gridImageUrl = await uploadImage(
//           gridFiles[i],
//           `locations/grid_${locationId}_${Date.now()}_${i}`
//         );
//         gridImageUrls[`image${i + 1}`] = gridImageUrl;
//       }
//       updatedLocationData.locationImages = {
//         ...updatedLocationData.locationImages,
//         ...gridImageUrls,
//       };
//     }

//     await updateDoc(locationRef, updatedLocationData);
//     return { id: locationId, ...updatedLocationData };
//   } catch (error) {
//     console.error('Error updating location:', error);
//     throw error;
//   }
// }

// export async function deleteLocation(locationId) {
//   try {
//     await deleteDoc(doc(db, 'locations', locationId));
//     // You may want to delete associated images from storage here
//   } catch (error) {
//     console.error('Error deleting location:', error);
//     throw error;
//   }
// }

// export async function deleteLocationImage(locationId, imageKey) {
//   try {
//     const locationRef = doc(db, 'locations', locationId);
//     const locationDoc = await getDoc(locationRef);

//     if (!locationDoc.exists()) {
//       throw new Error('Location not found');
//     }

//     const updatedImages = { ...locationDoc.data().locationImages };
//     delete updatedImages[imageKey];

//     await updateDoc(locationRef, { locationImages: updatedImages });

//     // Delete the image from storage
//     const storageRef = ref(storage, `locations/${locationId}/${imageKey}`);
//     await deleteObject(storageRef);
//   } catch (error) {
//     console.error('Error deleting location image:', error);
//     throw error;
//   }
// }

// export async function addLocationGridImage(locationId, file, url) {
//   try {
//     const locationRef = doc(db, 'locations', locationId);
//     const locationDoc = await getDoc(locationRef);

//     if (!locationDoc.exists()) {
//       throw new Error('Location not found');
//     }

//     const locationData = locationDoc.data();

//     const existingImages = locationData.locationImages || {};

//     // Find the next available image number
//     let nextImageNumber = 1;
//     while (existingImages[`image${nextImageNumber}`]) {
//       nextImageNumber++;
//     }

//     const newImageKey = `image${nextImageNumber}`;
//     const imageUrl = await uploadImage(
//       file[0],
//       `locations/${locationId}/grid_${newImageKey}_${Date.now()}`
//     );

//     const updatedLocationImages = {
//       ...existingImages,
//       [newImageKey]: url[0],
//     };

//     await updateDoc(locationRef, { locationImages: updatedLocationImages });

//     return { [newImageKey]: imageUrl };
//   } catch (error) {
//     console.error('Error adding location grid image:', error);
//     throw error;
//   }
// }

// Hero Banner Functions

export async function getLocations() {
  try {
    const locationsSnapshot = await getDocs(collection(db, 'locations'));
    return locationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      sequence: doc.data().sequence || 0,
    }));
  } catch (error) {
    console.error('Error getting locations:', error);
    throw error;
  }
}

export async function addLocation(locationData, mainFile, gridFiles) {
  try {
    const mainImageUrl = await uploadImage(
      mainFile,
      `locations/main_${Date.now()}`
    );

    const internalImages = await Promise.all(
      gridFiles.map(async (file, index) => {
        const url = await uploadImage(
          file,
          `locations/grid_${Date.now()}_${index}`
        );
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        return {
          id: `${Date.now()}-${index}`,
          url,
          ratio: img.width / img.height,
          order: index,
        };
      })
    );

    const newLocationData = {
      ...locationData,
      image: mainImageUrl,
      internalImages,
      sequence: Date.now(),
    };

    const docRef = await addDoc(collection(db, 'locations'), newLocationData);
    return { id: docRef.id, ...newLocationData };
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
}

export async function updateLocationSequence(updates) {
  const batch = writeBatch(db);

  updates.forEach(({ id, sequence }) => {
    const locationRef = doc(db, 'locations', id);
    batch.update(locationRef, { sequence });
  });

  try {
    await batch.commit();
  } catch (error) {
    console.error('Error updating location sequences:', error);
    throw error;
  }
}

export async function updateLocation(
  locationId,
  locationData,
  mainFile,
  gridFiles
) {
  try {
    const locationRef = doc(db, 'locations', locationId);
    let updatedLocationData = { ...locationData };

    if (mainFile) {
      // const mainImageUrl = await uploadImage(
      //   mainFile,
      //   `locations/main_${locationId}_${Date.now()}`
      // );
      updatedLocationData.image = mainFile;
    }

    if (gridFiles && gridFiles.length > 0) {
      const newInternalImages = await Promise.all(
        gridFiles.map(async (file, index) => {
          const url = await uploadImage(
            file,
            `locations/grid_${locationId}_${Date.now()}_${index}`
          );
          const img = new Image();
          img.src = URL.createObjectURL(file);
          await new Promise((resolve) => {
            img.onload = resolve;
          });
          return {
            id: `${Date.now()}-${index}`,
            url,
            ratio: img.width / img.height,
            order: updatedLocationData.internalImages.length + index,
          };
        })
      );
      updatedLocationData.internalImages = [
        ...updatedLocationData.internalImages,
        ...newInternalImages,
      ];
    }

    await updateDoc(locationRef, updatedLocationData);
    return { id: locationId, ...updatedLocationData };
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
}

export async function deleteLocation(locationId) {
  try {
    await deleteDoc(doc(db, 'locations', locationId));
    // You may want to delete associated images from storage here
  } catch (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
}

export async function deleteLocationImage(locationId, imageId) {
  try {
    const locationRef = doc(db, 'locations', locationId);
    const locationDoc = await getDoc(locationRef);

    if (!locationDoc.exists()) {
      throw new Error('Location not found');
    }

    const locationData = locationDoc.data();
    const updatedInternalImages = locationData.internalImages.filter(
      (img) => img.id !== imageId
    );

    await updateDoc(locationRef, { internalImages: updatedInternalImages });

    // Delete the image from storage
    const storageRef = ref(storage, `locations/${locationId}/${imageId}`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting location image:', error);
    throw error;
  }
}

export async function addLocationGridImage(locationId, file) {
  try {
    const locationRef = doc(db, 'locations', locationId);
    const locationDoc = await getDoc(locationRef);

    if (!locationDoc.exists()) {
      throw new Error('Location not found');
    }

    const locationData = locationDoc.data();
    const url = await uploadImage(
      file,
      `locations/${locationId}/grid_${Date.now()}`
    );

    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const newImage = {
      id: `${Date.now()}`,
      url,
      ratio: img.width / img.height,
      order: locationData.internalImages.length,
    };

    const updatedInternalImages = [...locationData.internalImages, newImage];

    await updateDoc(locationRef, { internalImages: updatedInternalImages });

    return newImage;
  } catch (error) {
    console.error('Error adding location grid image:', error);
    throw error;
  }
}

/**
 * Upload a hero banner image and add it to Firestore
 * @param {File} imageFile - The image file to upload
 * @param {number} sequence - The sequence number (0-3)
 * @returns {Promise<string>} The ID of the created hero banner document
 */
export const addHeroBanner = async (imageFile, sequence) => {
  try {
    // Upload image to Storage
    const storageRef = ref(
      storage,
      `heroBanners/${Date.now()}_${imageFile.name}`
    );
    const uploadResult = await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(uploadResult.ref);

    // Add to Firestore
    const heroBannerRef = collection(db, 'heroBanners');
    const docRef = await addDoc(heroBannerRef, {
      imageUrl,
      sequence,
      createdAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding hero banner:', error);
    throw error;
  }
};

/**
 * Get all hero banners ordered by sequence
 * @returns {Promise<Array>} Array of hero banners
 */
export const getHeroBanners = async () => {
  try {
    const heroBannerRef = collection(db, 'heroBanners');
    const q = query(heroBannerRef, orderBy('sequence'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting hero banners:', error);
    throw error;
  }
};

/**
 * Update a hero banner's image and/or sequence
 * @param {string} id - The hero banner document ID
 * @param {Object} updates - The updates to apply
 * @param {File} [updates.imageFile] - New image file (optional)
 * @param {number} [updates.sequence] - New sequence number (optional)
 */
export const updateHeroBanner = async (id, updates) => {
  try {
    const heroBannerRef = doc(db, 'heroBanners', id);
    const updateData = {};

    if (updates.imageFile) {
      // Upload new image
      const storageRef = ref(
        storage,
        `heroBanners/${Date.now()}_${updates.imageFile.name}`
      );
      const uploadResult = await uploadBytes(storageRef, updates.imageFile);
      updateData.imageUrl = await getDownloadURL(uploadResult.ref);

      // Delete old image if it exists
      const oldDoc = await getDoc(heroBannerRef);
      if (oldDoc.exists() && oldDoc.data().imageUrl) {
        const oldImageRef = ref(storage, oldDoc.data().imageUrl);
        await deleteObject(oldImageRef).catch(console.error);
      }
    }

    if (typeof updates.sequence === 'number') {
      updateData.sequence = updates.sequence;
    }

    await updateDoc(heroBannerRef, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating hero banner:', error);
    throw error;
  }
};

/**
 * Delete a hero banner and its image
 * @param {string} id - The hero banner document ID
 */
export const deleteHeroBanner = async (id) => {
  try {
    const heroBannerRef = doc(db, 'heroBanners', id);

    // Get the document to find the image URL
    const docSnap = await getDoc(heroBannerRef);
    if (docSnap.exists()) {
      const { imageUrl } = docSnap.data();

      // Delete image from Storage
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef).catch(console.error);
      }
    }

    // Delete document from Firestore
    await deleteDoc(heroBannerRef);
  } catch (error) {
    console.error('Error deleting hero banner:', error);
    throw error;
  }
};

/**
 * Update the sequence of multiple hero banners
 * @param {Array<{id: string, sequence: number}>} updates - Array of updates
 */
export const updateHeroBannerSequences = async (updates) => {
  try {
    const batch = writeBatch(db);

    updates.forEach(({ id, sequence }) => {
      const heroBannerRef = doc(db, 'heroBanners', id);
      batch.update(heroBannerRef, {
        sequence,
        updatedAt: new Date().toISOString(),
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error updating hero banner sequences:', error);
    throw error;
  }
};

// 1. Get client names and logos

// 2. Fetch product titles based on selected client

// 3. Fetch internal images based on selected product title

// 4. Create nested 'homepage' schema under still
// export async function createHomepageSchema(
//   clientId,
//   stillId,
//   selectedImageUrl,
//   sequence,
//   productTitle
// ) {
//   try {
//     const clientRef = doc(db, 'clients', clientId);
//     const clientDoc = await getDoc(clientRef);
//     if (clientDoc.exists()) {
//       const clientData = clientDoc.data();
//       const homepageData = {
//         image: selectedImageUrl,
//         sequence: sequence,
//         clientName: clientData.clientKey,
//         logo: clientData.image,
//         productTitle: productTitle,
//       };
//       await updateDoc(clientRef, {
//         [`stills.${stillId}.homepage`]: homepageData,
//       });
//       return homepageData;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error('Error creating homepage schema:', error);
//     throw error;
//   }
// }

// 5. Update sequence of stills on homepage
// export async function updateStillSequence(clientId, stillId, newSequence) {
//   try {
//     const clientRef = doc(db, 'clients', clientId);
//     await updateDoc(clientRef, {
//       [`stills.${stillId}.homepage.sequence`]: newSequence,
//     });
//   } catch (error) {
//     console.error('Error updating still sequence:', error);
//     throw error;
//   }
// }

// 6. Update all values under homepage schema
// export async function updateHomepageSchema(clientId, stillId, updatedData) {
//   try {
//     const clientRef = doc(db, 'clients', clientId);
//     await updateDoc(clientRef, {
//       [`stills.${stillId}.homepage`]: updatedData,
//     });
//   } catch (error) {
//     console.error('Error updating homepage schema:', error);
//     throw error;
//   }
// }

// 7. Add a new still grid item
export async function addStillGridItem(
  clientId,
  productTitle,
  file,
  isPortrait
) {
  try {
    const storageRef = ref(storage, `homeStill/${Date.now()}_${file.name}`);
    const uploadResult = await uploadBytes(storageRef, file);
    const croppedImageUrl = await getDownloadURL(uploadResult.ref);
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);
    if (clientDoc.exists()) {
      const clientData = clientDoc.data();

      const stills = clientData.stills || {};

      // Find the still with the matching product title
      const stillId = Object.keys(stills).find(
        (key) => stills[key].credits?.['PRODUCT TITLE'] === productTitle
      );

      if (stillId) {
        const newStillGridItem = {
          image: croppedImageUrl,
          isPortrait: isPortrait,
          rowOrder: Object.keys(stills).length,
          clientName: clientData.clientKey,
          logo: clientData.image,
          productTitle: productTitle,
          urlForSpecificStillPage: `/stills/${clientId}/${stillId}`,
        };

        await updateDoc(clientRef, {
          [`stills.${stillId}.homepage`]: newStillGridItem,
        });

        return { id: stillId, ...newStillGridItem };
      } else {
        throw new Error('No matching still found for the given product title');
      }
    } else {
      throw new Error('Client not found');
    }
  } catch (error) {
    console.error('Error adding still grid item:', error);
    throw error;
  }
}

// 9. Delete a still grid item
// export async function deleteStillGridItem(clientId, stillId) {
//   try {
//     const clientRef = doc(db, 'clients', clientId);
//     await updateDoc(clientRef, {
//       [`stills.${stillId}.homepage`]: deleteField(),
//     });
//   } catch (error) {
//     console.error('Error deleting still grid item:', error);
//     throw error;
//   }
// }

// 10. Update still grid item order
// export async function updateStillGridItemOrder(items) {
//   try {
//     const batch = writeBatch(db);

//     for (const item of items) {
//       const clientRef = doc(db, 'clients', item.clientId);
//       batch.update(clientRef, {
//         [`stills.${item.id}.homepage.rowOrder`]: item.rowOrder,
//       });
//     }

//     await batch.commit();
//   } catch (error) {
//     console.error('Error updating still grid item order:', error);
//     throw error;
//   }
// }

/// New still logic (May remove previous one)

export async function getHomeStills() {
  try {
    const homeStillsRef = collection(db, 'homeStills');
    const homeStillsQuery = query(homeStillsRef, orderBy('rowOrder'));
    const homeStillsSnapshot = await getDocs(homeStillsQuery);
    return homeStillsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching home stills:', error);
    throw error;
  }
}

// Add a new still grid item
export async function addHomeStill(clientId, productTitle, file, isPortrait) {
  try {
    const storageRef = ref(storage, `homeStill/${Date.now()}_${file.name}`);
    const uploadResult = await uploadBytes(storageRef, file);
    const croppedImageUrl = await getDownloadURL(uploadResult.ref);

    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);

    if (clientDoc.exists()) {
      const clientData = clientDoc.data();
      const homeStillsRef = collection(db, 'homeStills');
      const homeStillsQuery = query(
        homeStillsRef,
        orderBy('rowOrder', 'desc'),
        limit(1)
      );
      const homeStillsSnapshot = await getDocs(homeStillsQuery);
      const lastRowOrder = homeStillsSnapshot.empty
        ? -1
        : homeStillsSnapshot.docs[0].data().rowOrder;

      const newHomeStill = {
        image: croppedImageUrl,
        isPortrait: isPortrait,
        rowOrder: lastRowOrder + 1,
        clientName: clientData.clientKey,
        clientId: clientId,
        logo: clientData.image,
        productTitle: productTitle,
        urlForSpecificStillPage: `/stills/${clientId}/${productTitle}`,
      };

      const newHomeStillRef = await addDoc(homeStillsRef, newHomeStill);
      return { id: newHomeStillRef.id, ...newHomeStill };
    } else {
      throw new Error('Client not found');
    }
  } catch (error) {
    console.error('Error adding home still:', error);
    throw error;
  }
}

// Update an existing home still

export async function getClientsInfo() {
  try {
    const clientsRef = collection(db, 'clients');
    const clientsSnapshot = await getDocs(clientsRef);
    const clientsInfo = clientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().clientKey,
      logo: doc.data().image,
    }));
    return clientsInfo;
  } catch (error) {
    console.error('Error fetching clients info:', error);
    throw error;
  }
}

export async function updateHomeStill(stillId, updatedData) {
  try {
    const stillRef = doc(db, 'homeStills', stillId);
    await updateDoc(stillRef, updatedData);
  } catch (error) {
    console.error('Error updating home still:', error);
    throw error;
  }
}

export async function getProductTitlesByClient(clientId) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);
    if (clientDoc.exists()) {
      const stills = clientDoc.data().stills || {};
      const productTitles = Object.values(stills).map(
        (still) => still.credits?.['PRODUCT TITLE'] || 'Untitled Product'
      );
      return productTitles;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching product titles:', error);
    throw error;
  }
}

// Delete a home still
export async function deleteHomeStill(stillId) {
  try {
    const stillRef = doc(db, 'homeStills', stillId);
    await deleteDoc(stillRef);
  } catch (error) {
    console.error('Error deleting home still:', error);
    throw error;
  }
}

export async function getInternalImagesByProduct(clientId, productTitle) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);

    if (clientDoc.exists()) {
      const stills = clientDoc.data().stills || {};
      const selectedStill = Object.values(stills).find(
        (still) => still.credits?.['PRODUCT TITLE'] === productTitle
      );

      if (selectedStill) {
        const internalImages = selectedStill.internalImages || [];
        const imageUrls = internalImages.map((image) => image.url);

        return imageUrls;
      } else {
        console.warn('No such product!');
        return [];
      }
    } else {
      console.warn('No such client!');
      return [];
    }
  } catch (error) {
    console.error('Error fetching internal images:', error);
    throw error;
  }
}

// Update home still order
export async function updateHomeStillOrder(items) {
  try {
    const batch = writeBatch(db);

    for (const item of items) {
      const stillRef = doc(db, 'homeStills', item.id);
      batch.update(stillRef, { rowOrder: item.rowOrder });
    }

    await batch.commit();
  } catch (error) {
    console.error('Error updating home still order:', error);
    throw error;
  }
}

// Update grid size
export async function updateHomeStillGridSize(size) {
  try {
    const homeStillsRef = collection(db, 'homeStills');
    const homeStillsQuery = query(
      homeStillsRef,
      orderBy('rowOrder'),
      limit(size)
    );
    const homeStillsSnapshot = await getDocs(homeStillsQuery);

    const batch = writeBatch(db);
    homeStillsSnapshot.docs.forEach((doc, index) => {
      batch.update(doc.ref, { isVisible: true, rowOrder: index });
    });

    const remainingStillsQuery = query(
      homeStillsRef,
      orderBy('rowOrder'),
      limit(1000)
    );
    const remainingStillsSnapshot = await getDocs(remainingStillsQuery);
    remainingStillsSnapshot.docs.slice(size).forEach((doc) => {
      batch.update(doc.ref, { isVisible: false });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error updating home still grid size:', error);
    throw error;
  }
}

export async function updateStillGridItem(clientId, stillId, updatedData) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    await updateDoc(clientRef, {
      [`stills.${stillId}.homepage`]: updatedData,
    });
  } catch (error) {
    console.error('Error updating still grid item:', error);
    throw error;
  }
}

/// New still logic ends here
export async function getClientsForMotion() {
  try {
    const clientsRef = collection(db, 'clients');
    const clientsSnapshot = await getDocs(clientsRef);
    return clientsSnapshot.docs
      .filter((doc) => doc.data().motions && doc.data().motions.length > 0)
      .map((doc) => ({
        id: doc.id,
        name: doc.data().clientKey,
      }));
  } catch (error) {
    console.error('Error fetching clients for motion:', error);
    throw error;
  }
}

export async function getProductTitlesByClientForMotion(clientId) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);
    if (clientDoc.exists()) {
      const motions = clientDoc.data().motions || [];
      return [...new Set(motions.map((motion) => motion.productTitle))];
    }
    return [];
  } catch (error) {
    console.error('Error fetching product titles:', error);
    throw error;
  }
}

export async function getVideoByProductTitle(clientId, productTitle) {
  try {
    const clientRef = doc(db, 'clients', clientId);
    const clientDoc = await getDoc(clientRef);
    if (clientDoc.exists()) {
      const motions = clientDoc.data().motions || [];
      const selectedMotion = motions.find(
        (motion) => motion.productTitle === productTitle
      );
      if (selectedMotion) {
        return {
          url: selectedMotion.video,
          productTitle: selectedMotion.productTitle,
          clientName: clientDoc.data().clientKey,
          logo: selectedMotion.credits?.logo || clientDoc.data().image,
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
}

export async function uploadHomeMotion(clientId, productTitle, videoData) {
  try {
    const homeMotionsRef = collection(db, 'homeMotions');
    const newMotionRef = await addDoc(homeMotionsRef, {
      clientId,
      productTitle,
      thumbnail: videoData.url, // Using video URL as thumbnail for simplicity
      video: videoData.url,
      clientName: videoData.clientName,
      logo: videoData.logo,
      order: await getNextMotionOrder(),
    });
    return {
      id: newMotionRef.id,
      clientId,
      productTitle,
      thumbnail: videoData.url,
      video: videoData.url,
      clientName: videoData.clientName,
      logo: videoData.logo,
      order: await getNextMotionOrder(),
    };
  } catch (error) {
    console.error('Error uploading home motion:', error);
    throw error;
  }
}

async function getNextMotionOrder() {
  const homeMotionsRef = collection(db, 'homeMotions');
  const motionsQuery = query(
    homeMotionsRef,
    orderBy('order', 'desc'),
    limit(1)
  );
  const motionsSnapshot = await getDocs(motionsQuery);
  if (motionsSnapshot.empty) {
    return 0;
  }
  return motionsSnapshot.docs[0].data().order + 1;
}

export async function getHomeMotions() {
  try {
    const homeMotionsRef = collection(db, 'homeMotions');
    const motionsQuery = query(homeMotionsRef, orderBy('order'));
    const motionsSnapshot = await getDocs(motionsQuery);
    return motionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching home motions:', error);
    throw error;
  }
}

export async function updateHomeMotionOrder(motions) {
  const batch = writeBatch(db);
  motions.forEach((motion) => {
    const motionRef = doc(db, 'homeMotions', motion.id);
    batch.update(motionRef, { order: motion.order });
  });
  await batch.commit();
}

export async function deleteHomeMotion(motionId) {
  try {
    const motionRef = doc(db, 'homeMotions', motionId);
    await deleteDoc(motionRef);
  } catch (error) {
    console.error('Error deleting home motion:', error);
    throw error;
  }
}

export async function updateHomeMotion(updatedMotion) {
  try {
    const motionRef = doc(db, 'homeMotions', updatedMotion.id);
    await updateDoc(motionRef, {
      clientId: updatedMotion.clientId,
      productTitle: updatedMotion.productTitle,
      thumbnail: updatedMotion.thumbnail,
      video: updatedMotion.video,
      clientName: updatedMotion.clientName,
      logo: updatedMotion.logo,
    });
  } catch (error) {
    console.error('Error updating home motion:', error);
    throw error;
  }
}

// Fetch locations
export async function getHomeLocations() {
  try {
    const locationsRef = collection(db, 'locations');
    const locationsSnapshot = await getDocs(locationsRef);
    return locationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
}

// Fetch location image based on location text
export async function getHomeLocationImage(locationId) {
  try {
    const locationRef = doc(db, 'locations', locationId);
    const locationDoc = await getDoc(locationRef);
    if (locationDoc.exists()) {
      return locationDoc.data().image;
    }
    throw new Error('Location not found');
  } catch (error) {
    console.error('Error fetching location image:', error);
    throw error;
  }
}

// Upload data to homeLocation schema
export async function uploadHomeLocation(locationData) {
  try {
    const homeLocationsRef = collection(db, 'homeLocations');
    const newLocationRef = await addDoc(homeLocationsRef, {
      ...locationData,
      order: await getNextLocationOrder(),
    });
    return { id: newLocationRef.id, ...locationData };
  } catch (error) {
    console.error('Error uploading home location:', error);
    throw error;
  }
}

// Delete location data
export async function deleteHomeLocation(locationId) {
  try {
    const locationRef = doc(db, 'homeLocations', locationId);
    await deleteDoc(locationRef);
  } catch (error) {
    console.error('Error deleting home location:', error);
    throw error;
  }
}

// Update location data
export async function updateHomeLocation(updatedLocation) {
  try {
    const locationRef = doc(db, 'homeLocations', updatedLocation.id);
    await updateDoc(locationRef, updatedLocation);
  } catch (error) {
    console.error('Error updating home location:', error);
    throw error;
  }
}

// Get location data
export async function getHomeLocationsData() {
  try {
    const homeLocationsRef = collection(db, 'homeLocations');
    const locationsQuery = query(homeLocationsRef, orderBy('order'));
    const locationsSnapshot = await getDocs(locationsQuery);
    return locationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching home locations:', error);
    throw error;
  }
}

// Helper function to get the next order for a new location
async function getNextLocationOrder() {
  const homeLocationsRef = collection(db, 'homeLocations');
  const locationsQuery = query(
    homeLocationsRef,
    orderBy('order', 'desc'),
    limit(1)
  );
  const locationsSnapshot = await getDocs(locationsQuery);
  if (locationsSnapshot.empty) {
    return 0;
  }
  return locationsSnapshot.docs[0].data().order + 1;
}

// Fetch clients
export async function getHomeClients() {
  try {
    const clientsRef = collection(db, 'clients');
    const clientsSnapshot = await getDocs(clientsRef);
    return clientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

// Fetch client image based on client key
export async function getHomeClientImage(clientKey) {
  try {
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('clientKey', '==', clientKey));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data().image;
    }
    throw new Error('Client not found');
  } catch (error) {
    console.error('Error fetching client image:', error);
    throw error;
  }
}

// Upload data to homeClient schema
export async function uploadHomeClient(clientData, file) {
  const storageRef = ref(storage, `homeClient/${Date.now()}_${file.name}`);
  const uploadResult = await uploadBytes(storageRef, file);
  const croppedImageUrl = await getDownloadURL(uploadResult.ref);
  try {
    const homeClientsRef = collection(db, 'homeClients');
    const newClientRef = await addDoc(homeClientsRef, {
      ...clientData,
      image: croppedImageUrl,
      sequence: await getNextClientSequence(),
    });
    return { id: newClientRef.id, ...clientData };
  } catch (error) {
    console.error('Error uploading home client:', error);
    throw error;
  }
}

// Delete client data
export async function deleteHomeClient(clientId) {
  try {
    const clientRef = doc(db, 'homeClients', clientId);
    await deleteDoc(clientRef);
  } catch (error) {
    console.error('Error deleting home client:', error);
    throw error;
  }
}

// Update client data
export async function updateHomeClient(updatedClient, file) {
  const storageRef = ref(storage, `homeClient/${Date.now()}_${file.name}`);
  const uploadResult = await uploadBytes(storageRef, file);
  const croppedImageUrl = await getDownloadURL(uploadResult.ref);
  try {
    const clientRef = doc(db, 'homeClients', updatedClient.id);
    await updateDoc(clientRef, {
      ...updatedClient,
      image: croppedImageUrl,
    });
  } catch (error) {
    console.error('Error updating home client:', error);
    throw error;
  }
}

// Update client sequence
export async function updateHomeClientSequence(clients) {
  const batch = writeBatch(db);
  clients.forEach((client, index) => {
    const clientRef = doc(db, 'homeClients', client.id);
    batch.update(clientRef, { sequence: index });
  });
  await batch.commit();
}

// Get client data
export async function getHomeClientsData() {
  try {
    const homeClientsRef = collection(db, 'homeClients');
    const clientsQuery = query(homeClientsRef, orderBy('sequence'));
    const clientsSnapshot = await getDocs(clientsQuery);
    return clientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching home clients:', error);
    throw error;
  }
}

// Helper function to get the next sequence for a new client
async function getNextClientSequence() {
  const homeClientsRef = collection(db, 'homeClients');
  const clientsQuery = query(
    homeClientsRef,
    orderBy('sequence', 'desc'),
    limit(1)
  );
  const clientsSnapshot = await getDocs(clientsQuery);
  if (clientsSnapshot.empty) {
    return 0;
  }
  return clientsSnapshot.docs[0].data().sequence + 1;
}

export { db, storage };
