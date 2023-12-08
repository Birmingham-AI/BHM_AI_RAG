const showColumns = (fields) => {
  const columns = [];
  fields.forEach((field) => {
    columns.push({
      column_name: field.column_name,
      data_type: field.data_type,
    });
  });
  return columns;
};

const createOrUpdateConversation = async (db, data) => {
  if (data.message_id) {
    try {
      const query = `UPDATE conversation SET body = $1 WHERE id = $2`;
      const values = [messages, data.message_id];
      db.query(query, values, (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
        } else {
          console.log('Query results:', results.rows);
        }
      });
    } catch (error) {
      console.log(error);
    }
    return data.message_id;
  } else {
    try {
      const query = `INSERT INTO conversation (body) VALUES ($1)`;
      const values = [messages];
      const newMessage = db.query(query, values, (error) => {
        if (error) {
          console.error(`Error adding new conversation: ${error}`);
        } else {
          console.log(`New conversation added`);
          return newMessage.id;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
};

export { showColumns, createOrUpdateConversation };
