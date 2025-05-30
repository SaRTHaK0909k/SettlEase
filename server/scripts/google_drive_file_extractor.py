import io
from typing import Optional

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaIoBaseDownload
from google.oauth2.credentials import Credentials


class GoogleDriveDownloader:
    def __init__(self, oauth_token: str):
        self.creds = Credentials(oauth_token)
        self.service = build("drive", "v3", credentials=self.creds)

    def download_file(self, file_id: str) -> Optional[bytes]:
        """
        Downloads a file from Google Drive.

        Args:
            file_id (str): The ID of the file to download.

        Returns:
            Optional[bytes]: The file content as bytes, or None if download fails.
        """
        file_stream = io.BytesIO()
        try:
            request = self.service.files().get_media(fileId=file_id)
            downloader = MediaIoBaseDownload(file_stream, request)
            done = False
            while not done:
                status, done = downloader.next_chunk()
                print(f"Download {int(status.progress() * 100)}%.")
            return file_stream.getvalue()
        except HttpError as error:
            print(f"An error occurred: {error}")
            return None


# Example usage:
# downloader = GoogleDriveDownloader(oauth_token="YOUR_OAUTH_TOKEN")
# file_content = downloader.download_file(file_id="YOUR_FILE_ID")
# if file_content:
#     with open("output_file", "wb") as f:
#         f.write(file_content)