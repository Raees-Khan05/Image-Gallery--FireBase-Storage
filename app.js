// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore ,
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import {
    getStorage
    , ref,
    uploadBytes,
    getDownloadURL,

} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyARoumL2e85JzTtz9uhxRCaVDDb2mgzbGQ",
    authDomain: "first-project-cc18b.firebaseapp.com",
    projectId: "first-project-cc18b",
    storageBucket: "first-project-cc18b.appspot.com",
    messagingSenderId: "770785505812",
    appId: "1:770785505812:web:cd9aa86b5761327af16d01",
    measurementId: "G-WC0ZSCJ5ES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app, //"gs://my-custom-bucket"
);
const db = getFirestore(app);
const carsCollection = collection(db , "cars")
console.log("storage==>", storage);
// const analytics = getAnalytics(app);



const carImg = document.getElementById('car_img')
const saveFile = document.getElementById('save_file')
const container = document.getElementById('container')

getImagesFromDB()

saveFile.addEventListener("click", () => {

    console.log(carImg.files[0]);

    const carStorageRef = ref(storage, carImg.files[0].name);



    // ye function upload karta he files ko db me storage me
    saveFile.disabled = true
    uploadBytes(carStorageRef, carImg.files[0])
        .then((snapshot) => {
            console.log('Uploaded a blob or file!');

            //get url from the same storage refference 
            getDownloadURL(carStorageRef)
                .then((url) => {
                    // ab ham url or category ko add krenge 

                    console.log('url' , url)

                    addDoc(carsCollection ,  {category : "cars" , url}).then(() => {
                        console.log("Document uploaded to the db");
                        getImagesFromDB()
                        saveFile.disabled = false
                    });
                })
                .catch((err) => {console.log("error in download", err) ,
                    saveFile.disabled = false;

                });
            })
                .catch((err) => console.log(err));
                    
                
      
});



async function getImagesFromDB(){

    const querySnapshot = await getDocs(carsCollection);
    container.innerHTML = '';
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => `);

      console.log(doc.data());

      const img = `<img 
                    id= ${doc.id}
                    src =${doc.data().url}
                style="height: 300px; width: 300px; border-radius: 12px; margin: 31px;" />`;
                container.innerHTML += img
    });
}