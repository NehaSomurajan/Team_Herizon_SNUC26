export default function ActionButtons({ onCheckIn }) {
  return (
    <div className="actions">
      <button onClick={onCheckIn}>Check In Today</button>
    </div>
  );
}