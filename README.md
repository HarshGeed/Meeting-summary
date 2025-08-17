# AI Meeting Notes Summarizer

A full-stack Next.js application that uses AI to summarize meeting transcripts and share them via email.

## Features

- **File Upload**: Upload text transcripts (.txt, .doc, .docx) or paste text directly
- **Custom Prompts**: Specify how you want the AI to summarize (e.g., "Summarize in bullet points for executives")
- **AI Generation**: Uses OpenAI GPT-3.5-turbo to generate intelligent summaries
- **Editable Summaries**: Edit and refine AI-generated summaries before sharing
- **Email Sharing**: Send summaries to multiple recipients with custom messages

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI Service**: Groq (Llama3-8b-8192)
- **Email Service**: Nodemailer with Brevo SMTP
- **Backend**: Next.js API Routes

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd mango-desk
npm install
```

### 2. Environment Configuration

Copy the environment template and configure your API keys:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual credentials:

```env
# Groq API Configuration
GROQ_API_KEY=your-actual-groq-api-key

# Brevo Email Configuration
BREVO_USER=your-verified-sender-email@example.com
BREVO_API_KEY=your-actual-brevo-api-key
```

#### Getting Your Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env.local` file

#### Setting Up Brevo for Sending Emails

1. Go to [Brevo Console](https://app.brevo.com/) and create an account
2. Verify your sender email address in the Senders & Domains section
3. Navigate to Settings → API Keys
4. Create a new API key with SMTP permissions
5. Use your verified email and API key in your `.env.local` file

### 3. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Step 1: Upload Transcript
- Click "Choose File" to upload a transcript file
- Or paste your transcript text directly into the text area

### Step 2: Customize Instructions
- Modify the default prompt or write your own
- Examples:
  - "Summarize in bullet points for executives"
  - "Highlight only action items and deadlines"
  - "Create a timeline of events discussed"

### Step 3: Generate Summary
- Click "Generate Summary"
- Wait for the AI to process your transcript
- The summary will appear in an editable text area

### Step 4: Edit and Share
- Edit the generated summary as needed
- Enter recipient email addresses (comma-separated)
- Add an optional personal message
- Click "Send Email" to share

## API Endpoints

### POST /api/generate-summary
Generates AI summaries from transcripts.

**Request Body:**
```json
{
  "transcript": "Your meeting transcript text...",
  "prompt": "Your custom instructions..."
}
```

**Response:**
```json
{
  "summary": "AI-generated summary..."
}
```

### POST /api/send-email
Sends summaries via email.

**Request Body:**
```json
{
  "summary": "Your summary text...",
  "recipients": ["email1@example.com", "email2@example.com"],
  "message": "Optional personal message"
}
```

## Customization

### Using Different AI Services

The application is designed to work with Groq, but you can easily modify it to use other AI services:

1. Update the API route in `app/api/generate-summary/route.ts`
2. Modify the prompt structure for your chosen service
3. Update environment variables accordingly

### Email Service Configuration

To use email services other than Brevo:

1. Update the transporter configuration in `app/api/send-email/route.ts`
2. Modify the SMTP settings for your provider
3. Update environment variables

## Troubleshooting

### Common Issues

1. **"Groq API key not configured"**
   - Ensure your `.env.local` file exists and contains `GROQ_API_KEY`
   - Restart the development server after adding environment variables

2. **"Failed to send email"**
   - Check your Brevo credentials in `.env.local`
   - Ensure your sender email is verified in Brevo
   - Verify your API key has SMTP permissions

3. **"Failed to generate summary"**
   - Verify your Groq API key is valid
   - Check your Groq account has sufficient credits
   - Ensure the transcript text is not empty

### Development Tips

- Use the browser's developer console to see detailed error messages
- Check the terminal where you're running `npm run dev` for server-side errors
- Verify all environment variables are loaded correctly

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
