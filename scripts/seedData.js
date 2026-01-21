import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";

// Configuration from src/lib/firebase.ts
const firebaseConfig = {
    apiKey: "AIzaSyDtKJgKMrEAh89O82mRox7rJOSXO8O2RtA",
    authDomain: "workflowhq.firebaseapp.com",
    projectId: "workflowhq",
    storageBucket: "workflowhq.firebasestorage.app",
    messagingSenderId: "1084253295476",
    appId: "1:1084253295476:web:83ed7d2fa5727a23a4d221"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const USER_ID = "ul4GCMmeBPYYa2RUPEmvLz0csnu2"; // Anurag Kundu

const main = async () => {
    console.log("Seeding data for user:", USER_ID);

    try {
        // 1. Tasks
        console.log("Seeding Tasks...");
        await addDoc(collection(db, "tasks"), {
            title: "Review Project Proposal",
            description: "Review the new project proposal from the client.",
            priority: "high",
            completed: false,
            user_id: USER_ID,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        await addDoc(collection(db, "tasks"), {
            title: "Update Website Content",
            description: "Update the homepage content with the new marketing copy.",
            priority: "medium",
            completed: true,
            user_id: USER_ID,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date().toISOString()
        });

        // 2. Notes
        console.log("Seeding Notes...");
        await addDoc(collection(db, "notes"), {
            title: "Meeting Notes - Jan 20",
            content: "Discussed the new feature roadmap. Key takeaways:\n- Focus on mobile responsiveness\n- Improve loading speed",
            user_id: USER_ID,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        // 3. Invoices
        console.log("Seeding Invoices...");
        await addDoc(collection(db, "invoices"), {
            invoice_number: "INV-2024-001",
            client_name: "Acme Corp",
            client_email: "billing@acme.com",
            client_address: "123 Business Rd, Tech City",
            invoice_date: new Date().toISOString().split('T')[0],
            due_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
            items: [
                { id: "1", description: "Web Development", quantity: 10, rate: 150, amount: 1500 },
                { id: "2", description: "Hosting Setup", quantity: 1, rate: 200, amount: 200 }
            ],
            subtotal: 1700,
            tax_rate: 10,
            tax_amount: 170,
            total: 1870,
            status: "sent",
            user_id: USER_ID,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        // 4. Time Entries
        console.log("Seeding Time Entries...");
        await addDoc(collection(db, "time_entries"), {
            project_name: "WorkflowHQ Dev",
            description: "Implementing Firebase Migration",
            start_time: new Date(Date.now() - 3600000).toISOString(),
            end_time: new Date().toISOString(),
            duration: 3600,
            is_running: false,
            user_id: USER_ID,
            created_at: new Date().toISOString()
        });

        console.log("Seeding complete! Please verify in the dashboard.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

main();
