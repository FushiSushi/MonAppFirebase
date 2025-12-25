import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, StatusBar } from "react-native";
import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc
} from "firebase/firestore";

export default function App() {
  // 🖥 Gestion des écrans
  const [screen, setScreen] = useState("login"); // "login" | "register" | "tasks"

  // 🔐 Auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 📊 Firestore
  const [taches, setTaches] = useState([]);
  const [nouvelleTache, setNouvelleTache] = useState("");

  // 📝 Créer un compte
  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Utilisateur créé !");
      setScreen("tasks"); // Aller vers écran tâches
    } catch (error) {
      console.error("❌ Erreur création:", error);
    }
  };

  // 🔑 Se connecter
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Connecté !");
      setScreen("tasks"); // Aller vers écran tâches
    } catch (error) {
      console.error("❌ Erreur login:", error);
    }
  };

  // ➕ Ajouter une tâche
  const ajouterTache = async () => {
    if (nouvelleTache.trim() === "") return;
    try {
      await addDoc(collection(db, "taches"), {
        titre: nouvelleTache,
        fait: false,
      });
      console.log("✅ Tâche ajoutée !");
      setNouvelleTache("");
      lireTaches();
    } catch (error) {
      console.error("❌ Erreur ajout:", error);
    }
  };

  // ✏️ Basculer l'état d'une tâche
  const basculerTache = async (id, etatActuel) => {
    try {
      await updateDoc(doc(db, "taches", id), {
        fait: !etatActuel,
      });
      console.log("✅ Tâche mise à jour !");
      lireTaches();
    } catch (error) {
      console.error("❌ Erreur mise à jour:", error);
    }
  };

  // 🗑️ Supprimer une tâche
  const supprimerTache = async (id) => {
    try {
      await deleteDoc(doc(db, "taches", id));
      console.log("✅ Tâche supprimée !");
      lireTaches();
    } catch (error) {
      console.error("❌ Erreur suppression:", error);
    }
  };

  // 📖 Lire les tâches
  const lireTaches = async () => {
    const querySnapshot = await getDocs(collection(db, "taches"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTaches(data);
  };

  useEffect(() => {
    if (screen === "tasks") {
      lireTaches();
    }
  }, [screen]);

  // 🎨 Rendu des écrans
  if (screen === "login") {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Connexion</Text>
          <Text style={styles.headerSubtitle}>Bienvenue sur TaskManager</Text>
        </View>
        
        <View style={styles.form}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          
          <TouchableOpacity style={styles.primaryButton} onPress={login}>
            <Text style={styles.primaryButtonText}>Se connecter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen("register")}>
            <Text style={styles.secondaryButtonText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screen === "register") {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Inscription</Text>
          <Text style={styles.headerSubtitle}>Créez votre compte</Text>
        </View>
        
        <View style={styles.form}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          
          <TouchableOpacity style={styles.primaryButton} onPress={register}>
            <Text style={styles.primaryButtonText}>Créer un compte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen("login")}>
            <Text style={styles.secondaryButtonText}>Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screen === "tasks") {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes Tâches</Text>
          <Text style={styles.headerSubtitle}>{taches.length} tâche(s)</Text>
        </View>
        
        <View style={styles.tasksContainer}>
          <View style={styles.addTaskForm}>
            <TextInput
              placeholder="Nouvelle tâche..."
              placeholderTextColor="#9ca3af"
              value={nouvelleTache}
              onChangeText={setNouvelleTache}
              style={styles.taskInput}
            />
            <TouchableOpacity style={styles.addButton} onPress={ajouterTache}>
              <Text style={styles.addButtonText}>➕</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={taches}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <TouchableOpacity 
                  style={styles.taskContent}
                  onPress={() => basculerTache(item.id, item.fait)}
                >
                  <Text style={styles.taskStatus}>{item.fait ? "✅" : "⏳"}</Text>
                  <Text style={[styles.taskTitle, item.fait && styles.taskDone]}>
                    {item.titre}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => supprimerTache(item.id)}>
                  <Text style={styles.deleteButton}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.tasksList}
          />
          
          <TouchableOpacity style={styles.logoutButton} onPress={() => setScreen("login")}>
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    backgroundColor: "#6366f1",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e0e7ff",
  },
  form: {
    padding: 20,
    marginTop: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  secondaryButtonText: {
    color: "#6366f1",
    fontSize: 16,
    fontWeight: "600",
  },
  tasksContainer: {
    flex: 1,
    padding: 20,
  },
  addTaskForm: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  taskInput: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  addButton: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  tasksList: {
    paddingBottom: 20,
  },
  taskItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  taskTitle: {
    fontSize: 16,
    color: "#1f2937",
    flex: 1,
  },
  taskDone: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  taskStatus: {
    fontSize: 24,
  },
  deleteButton: {
    fontSize: 24,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
