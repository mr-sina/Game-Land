import dotenv from 'dotenv'
import app from './src/utils/express'
import './src/utils/db'
// Read environment variables
dotenv.config({ path: './.env' });
const port = process.env.PORT || 4040;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});