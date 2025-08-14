import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { getAuth } from "firebase/auth";

const MatchHistory = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;

            try {
                const auth = getAuth();
        const idToken = await auth.currentUser.getIdToken(true); // 🔐 Get Firebase ID token

                const res = await axios.get("http://localhost:5000/api/history", {
                    headers: {
                        Authorization: `${idToken}` // 🔐 Pass token in header
                    },
                    params: {
                        email: user.email
                    }
                });

                setHistory(res.data.reverse()); // latest first
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">Loading your match history...</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 px-6 py-10">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
                    📄 Resume Match History
                </h2>

                {history.length === 0 ? (
                    <p className="text-center text-gray-600">No matches found yet.</p>
                ) : (
                    <div className="space-y-6">
                        {history.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-lg transition duration-200 hover:shadow-xl"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="md:w-full">
                                        <p className="text-sm text-gray-500 mb-1">
                                            <strong>Timestamp:</strong>{" "}
                                            {new Date(item.timestamp).toLocaleString()}
                                        </p>
                                        <p className="text-green-700 font-semibold text-lg mb-2">
                                            Match Score: {item.score.toFixed(2)}%
                                        </p>
                                        <div>
                                            <strong className="block mb-1 text-gray-800">
                                                Top Keywords:
                                            </strong>
                                            <div className="flex flex-wrap gap-2">
                                                {item.keywords?.map((keyword, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatchHistory;
