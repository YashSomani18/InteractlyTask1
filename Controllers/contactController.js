import axios from "axios";
import mysql from "mysql2";

const freshsalesApiKey = process.env.FRESHSALESAPIKEY;
const freshsalesApiUrl = "https://widgetz.freshsales.io/api/contacts";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "Contacts",
});

export const createContact = async (req, res) => {
  const { first_name, last_name, email, mobile_number, data_store } = req.body;

  if (data_store === "CRM") {
    try {
      const response = await axios.post(
        freshsalesApiUrl,
        {
          contact: { first_name, last_name, email, mobile_number },
        },
        {
          headers: {
            Authorization: `Token token=${freshsalesApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    const query =
      "INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)";
    db.query(
      query,
      [first_name, last_name, email, mobile_number],
      (err, result) => {
        if (err) {
          res.status(500).send(err.message);
        } else {
          res.json({
            id: result.insertId,
            first_name,
            last_name,
            email,
            mobile_number,
          });
        }
      }
    );
  }
};

export const getContact = async (req, res) => {
  const { contact_id, data_store } = req.body;

  if (data_store === "CRM") {
    try {
      const response = await axios.get(
        `${freshsalesApiUrl}/${contact_id}?include=sales_accounts`,
        {
          headers: {
            Authorization: `Token token=${freshsalesApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    const query = "SELECT * FROM contacts WHERE id = ?";
    db.query(query, [contact_id], (err, results) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json(results[0]);
      }
    });
  }
};

export const updateContact = async (req, res) => {
  const { contact_id, new_email, new_mobile_number, data_store } = req.body;

  if (data_store === "CRM") {
    try {
      const response = await axios.put(
        `${freshsalesApiUrl}/${contact_id}`,
        {
          contact: { email: new_email, mobile_number: new_mobile_number },
        },
        {
          headers: {
            Authorization: `Token token=${freshsalesApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    const query =
      "UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?";
    db.query(
      query,
      [new_email, new_mobile_number, contact_id],
      (err, result) => {
        if (err) {
          res.status(500).send(err.message);
        } else {
          res.json({ success: true });
        }
      }
    );
  }
};

export const deleteContact = async (req, res) => {
  const { contact_id, data_store } = req.body;

  if (data_store === "CRM") {
    try {
      await axios.delete(`${freshsalesApiUrl}/${contact_id}`, {
        headers: {
          Authorization: `Token token=${freshsalesApiKey}`,
          "Content-Type": "application/json",
        },
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    const query = "DELETE FROM contacts WHERE id = ?";
    db.query(query, [contact_id], (err, result) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json({ success: true });
      }
    });
  }
};
