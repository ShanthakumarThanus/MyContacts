import React, { useEffect, useState } from "react";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [editContactId, setEditContactId] = useState(null);
  const [editData, setEditData] = useState({});

  // Fonction qui va récupérer les contacts de l'utilisateur
  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token"); // récupère le token du login
      if (!token) {
        setError("Veuillez vous reconnecter.");
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/contacts`, {
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

        const res = await fetch(`${process.env.REACT_APP_API_URL}/contacts`, {
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

  // Fonction pour supprimer un contact
  const handleDeleteContact = async (id) => {
    if (!window.confirm("Supprimer ce contact ?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setContacts(contacts.filter((c) => c._id !== id));
      } else {
        const data = await res.json();
        setError(data.message || "Erreur lors de la suppression");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    }
  };

  // Passe un contact en mode édition
  const startEdit = (contact) => {
    setEditContactId(contact._id);
    setEditData({ ...contact });
  };

  // Sauvegarde les modifications
  const handleUpdateContact = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/contacts/${editContactId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Erreur lors de la mise à jour");

      setContacts(contacts.map((c) => (c._id === editContactId ? data : c)));
      setEditContactId(null); // quitte le mode édition
    } catch {
      setError("Erreur de connexion au serveur");
    }
  };

  // useEffect = exécute la requête dès le chargement du composant
  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <h3>Ajouter un contact</h3>
          <form onSubmit={handleAddContact} style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px", width: "300px", }}>
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
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, ""); 
                  // Autoriser seulement jusqu'à 20 chiffres
                  if (onlyNumbers.length <= 20) {
                    setFormData({ ...formData, phone: onlyNumbers });
                  }
                }}
                required
                minLength={10}
                maxLength={20}
                pattern="\d{10,20}"
                title="Le numéro doit contenir entre 10 et 20 chiffres"
              />
              <button type="submit">Ajouter</button>
          </form>

        <h3>Mes contacts</h3>
        {contacts.length === 0 && <p>Aucun contact.</p>}
        <ul>
        {contacts.map((contact) => (
          <li key={contact._id} style={{ marginBottom: "10px", display: "grid", alignItems: "center", justifyContent: "space-between",padding: "8px 0", gridTemplateColumns: "1fr 1fr 1fr auto auto",}}>
            {editContactId === contact._id ? (
              <>
                <input
                  type="text"
                  placeholder="Prénom"
                  value={editData.firstName}
                  onChange={(e) =>
                    setEditData({ ...editData, firstName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={editData.lastName}
                  onChange={(e) =>
                    setEditData({ ...editData, lastName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Téléphone"
                  value={editData.phone}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    if (onlyNumbers.length <= 20) {
                      setEditData({ ...editData, phone: onlyNumbers });
                    }
                  }}
                  required
                  minLength={10}
                  maxLength={20}
                  pattern="\d{10,20}"
                  title="Le numéro doit contenir entre 10 et 20 chiffres"
                />
                <button onClick={handleUpdateContact}>💾 Enregistrer</button>
                <button onClick={() => setEditContactId(null)}>❌ Annuler</button>
              </>
            ) : (
              <>
                <strong>
                  {contact.firstName} {contact.lastName}
                </strong>{" "}
                {contact.phone}
                <button onClick={() => startEdit(contact)}>✏️ Modifier</button>
                <button onClick={() => handleDeleteContact(contact._id)}>🗑️ Supprimer</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
