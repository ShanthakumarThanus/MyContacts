import React, { useEffect, useState } from "react";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  // Fonction qui va récupérer les contacts de l'utilisateur
  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token"); // récupère le token du login
      if (!token) {
        setError("Aucun token trouvé. Veuillez vous reconnecter.");
        return;
      }

      const res = await fetch("http://localhost:4000/contacts", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de la récupération des contacts");
        return;
      }

      setContacts(data); // stocke les contacts dans le state
    } catch (err) {
      setError("Erreur de connexion au serveur");
    }
  };

  // Fonction pour ajouter un contact
  const handleAddContact = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Erreur : Veuillez vous reconnecter.");
            return;
        }

        const res = await fetch("http://localhost:4000/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || "Erreur lors de la création du contact");
            return;
        }

        // Ajoute le contact à la liste
        setContacts([...contacts, data]);
        setFormData({ firstName: "", lastName: "", phone: ""});
    } catch (err) {
        setError("Erreur de connexion au serveur");
    }
  }


  // useEffect = exécute la requête dès le chargement du composant
  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <h3>Ajouter un contact</h3>
        <form onSubmit={handleAddContact} style={{ marginBottom: "20px" }}>
            <input
                type="text"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Nom"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Téléphone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
            />
            <button type="submit">Ajouter</button>
        </form>

        <h3>Mes contacts</h3>
        {contacts.length === 0 && <p>Aucun contact.</p>}
        <ul>
            {contacts.map((contact) => (
                <li key={contact._id}>
                    <strong>{contact.firstName} {contact.lastName}</strong> - {contact.phone}
                </li>
            ))}
        </ul>
    </div>
  );
}
