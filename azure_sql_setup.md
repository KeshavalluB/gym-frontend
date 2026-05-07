# 🚀 Step-by-Step: Creating your Azure SQL Database

Follow these steps to set up the real cloud backend for your GymPro portal.

### 1. Sign in to Azure
*   Go to the [Azure Portal](https://portal.azure.com/).
*   Sign in with your Microsoft account.

### 2. Create the SQL Database resource
*   Click **"Create a resource"** at the top left.
*   Search for **"SQL Database"** and click **Create**.
*   **Project Details**:
    *   **Subscription**: Select yours.
    *   **Resource Group**: Click "Create new" (Name it: `gympro-group`).
*   **Database Details**:
    *   **Database name**: `gympro-db`.
    *   **Server**: Click "Create new".
        *   Server name: `gympro-server-yourname` (must be unique).
        *   Location: Choose one close to you (e.g., East US).
        *   Authentication: Select **"Use SQL authentication"**.
        *   **Set Login/Password**: (e.g., `gymadmin` / `GymProAzure123!`). **Save these!**

### 3. Configure Networking (CRITICAL)
*   Go to your new **SQL Server** page in the portal.
*   In the left menu, click **"Networking"**.
*   Under **Firewall rules**:
    *   Check **"Allow Azure services and resources to access this server"**.
    *   Click **"+ Add your client IPv4 address"** so your local computer can connect.
*   Click **Save**.

### 4. Run the GymPro Schema
*   Go to your **SQL Database** page.
*   Click **"Query editor (preview)"** in the left menu.
*   Login with the username/password you created in Step 2.
*   Open the file **`azure_database_schema.sql`** from your project.
*   **Copy the entire content** and paste it into the Query Editor.
*   Click **Run**. Your tables (Members, Trainers, Payments) are now live in the cloud!

### 5. Get your Connection String
*   On the SQL Database page, click **"Connection strings"** in the left menu.
*   Copy the string under the **ADO.NET** tab.
*   It will look like this:
    `Server=tcp:gympro-server.database.windows.net,1433;Initial Catalog=gympro-db;Persist Security Info=False;User ID=gymadmin;Password={your_password};...`

### 6. Connect to the Frontend
*   Create a file named `.env.local` in your root folder.
*   Add this line:
    `AZURE_SQL_CONNECTION_STRING="PASTE_YOUR_STRING_HERE"`

**Your GymPro portal is now officially connected to the Azure Cloud!**
