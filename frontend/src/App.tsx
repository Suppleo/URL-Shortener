import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Alert } from "react-bootstrap";

interface UrlData {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
}

function App() {
  const [url, setUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [urlToDelete, setUrlToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<UrlData[]>(
        "https://url-shortener-9o0q.onrender.com/api/urls"
      );
      setUrls(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching URLs:", error);
      setError("Failed to fetch URLs. Please try again later.");
      setUrls([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://url-shortener-9o0q.onrender.com/api/shorten",
        {
          url,
        }
      );
      setShortUrl(response.data.shortUrl);
      fetchUrls(); // Refresh the URL list
      setError(null);
    } catch (error) {
      console.error("Error shortening URL:", error);
      setError("Failed to shorten URL. Please try again.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleDelete = (id: string) => {
    setUrlToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (urlToDelete) {
      try {
        await axios.delete(
          `https://url-shortener-9o0q.onrender.com/api/urls/${urlToDelete}`
        );
        fetchUrls(); // Refresh the URL list
        setError(null);
      } catch (error) {
        console.error("Error deleting URL:", error);
        setError("Failed to delete URL. Please try again.");
      }
    }
    setShowModal(false);
    setUrlToDelete(null);
  };

  // Add this useEffect to disable flex on the body
  useEffect(() => {
    document.body.style.display = "block";
    return () => {
      document.body.style.display = "";
    };
  }, []);

  return (
    <div className="container-fluid d-flex flex-column align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="my-2">URL Shortener</h1>
        <h2 className="mb-3 text-secondary">Made by: Suppleo</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="input-group">
            <input
              type="url"
              className="form-control"
              value={url}
              onChange={handleChange}
              placeholder="Enter URL to shorten"
              required
            />
            <button type="submit" className="btn btn-primary">
              Shorten
            </button>
          </div>
        </form>
        {shortUrl && (
          <div className="mb-4">
            <h3>Shortened URL:</h3>
            <a
              href={`https://url-shortener-9o0q.onrender.com/thach.lalala/${shortUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {`thach.lalala/${shortUrl}`}
            </a>
          </div>
        )}
        <h2 className="mb-3">All shortened URLs</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : Array.isArray(urls) && urls.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Original URL</th>
                  <th>Short URL</th>
                  <th>Clicks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url._id}>
                    <td>{url.originalUrl}</td>
                    <td>
                      <a
                        href={`https://url-shortener-9o0q.onrender.com/thach.lalala/${url.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`thach.lalala/${url.shortUrl}`}
                      </a>
                    </td>
                    <td>{url.clicks}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(url._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No shortened URLs yet. Create one above!</p>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this link?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
