import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ActivityDetailPage = () => {
  const { id } = useParams(); // Mengambil ID dari URL
  const [activityDetail, setActivityDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityById = async () => {
      try {
        const response = await axios.get(
          `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-activities/${id}`
        );
        setActivityDetail(response.data.result);
      } catch (error) {
        console.error("Error fetching activity details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityById();
  }, [id]); // Menjalankan ulang efek jika ID berubah

  if (loading) return <p>Loading...</p>;

  if (!activityDetail) return <p>No activity found.</p>;

  return (
    <div className="max-w-lg mx-auto bg-white p-5 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">{activityDetail.title}</h2>
      <p dangerouslySetInnerHTML={{ __html: activityDetail.description }}></p>
      <p>Category: {activityDetail.sport_category.name}</p>
      <p>
        Price: Rp{activityDetail.price} (Discount: Rp
        {activityDetail.price_discount})
      </p>
      <p>Slot: {activityDetail.slot}</p>
      <p>Location: {activityDetail.address}</p>
      <p>Date: {activityDetail.activity_date}</p>
      <p>
        Time: {activityDetail.start_time} - {activityDetail.end_time}
      </p>
      <p>Organizer: {activityDetail.organizer.name}</p>
      <p>
        City: {activityDetail.city.city_name_full}, Province:{" "}
        {activityDetail.city.province.province_name}
      </p>

      <h3 className="text-xl font-semibold mt-4">Participants</h3>
      {activityDetail.participants.length > 0 ? (
        <ul>
          {activityDetail.participants.map((participant) => (
            <li key={participant.id}>
              {participant.user.name} ({participant.user.email})
            </li>
          ))}
        </ul>
      ) : (
        <p>No participants yet.</p>
      )}

      <a
        href={activityDetail.map_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline mt-2 block"
      >
        View on Map
      </a>
    </div>
  );
};

export default ActivityDetailPage;
