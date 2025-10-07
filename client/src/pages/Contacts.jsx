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
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Veuillez vous reconnecter.");
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de la récupération des contacts");
        return;
      }

      setContacts(data);
    } catch {
      setError("Erreur de connexion au serveur");
    }
  };

  // Ajouter un contact
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Erreur lors de la création du contact");
        return;
      }

      setContacts([...contacts, data]);
      setFormData({ firstName: "", lastName: "", phone: "" });
    } catch {
      setError("Erreur de connexion au serveur");
    }
  };

  // Supprimer un contact
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
      setEditContactId(null);
    } catch {
      setError("Erreur de connexion au serveur");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "700px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📇 Mes Contacts</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* --- Formulaire d'ajout --- */}
      <div
        style={{
          background: "#f9f9f9",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "25px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Ajouter un contact</h3>
        <form
          onSubmit={handleAddContact}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Prénom"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
            }}
          />
          <input
            type="text"
            placeholder="Nom"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
            }}
          />
          <input
            type="text"
            placeholder="Téléphone"
            value={formData.phone}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              if (onlyNumbers.length <= 20) {
                setFormData({ ...formData, phone: onlyNumbers });
              }
            }}
            required
            minLength={10}
            maxLength={20}
            pattern="\d{10,20}"
            title="Le numéro doit contenir entre 10 et 20 chiffres"
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ➕ Ajouter
          </button>
        </form>
      </div>

      {/* --- Liste des contacts --- */}
      <h3 style={{ marginBottom: "10px" }}>Liste des contacts</h3>
      {contacts.length === 0 && <p>Aucun contact enregistré.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {contacts.map((contact) => (
          <li
            key={contact._id}
            style={{
              marginBottom: "10px",
              background: "#f1f1f1",
              padding: "10px",
              borderRadius: "6px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr auto auto",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {editContactId === contact._id ? (
              <>
                <input
                  type="text"
                  value={editData.firstName}
                  onChange={(e) =>
                    setEditData({ ...editData, firstName: e.target.value })
                  }
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                />
                <input
                  type="text"
                  value={editData.lastName}
                  onChange={(e) =>
                    setEditData({ ...editData, lastName: e.target.value })
                  }
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                />
                <input
                  type="text"
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
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                />
                <button
                  onClick={handleUpdateContact}
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  💾
                </button>
                <button
                  onClick={() => setEditContactId(null)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  ❌
                </button>
              </>
            ) : (
              <>
                <strong>{contact.firstName}</strong>
                <span>{contact.lastName}</span>
                <span>{contact.phone}</span>
                <button
                  onClick={() => startEdit(contact)}
                  style={{
                    backgroundColor: "#ffc107",
                    color: "black",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteContact(contact._id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  🗑️
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
