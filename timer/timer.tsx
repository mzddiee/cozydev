import PomodoroTimer from './pomodoro';

export default function RadioPage() {
  return (
    <div>
      <PomodoroTimer />
    </div>
  );
}

/* We can add this if someone here is familiar with SQL: API like this: sql GET /api/radio?mood=study → returns a list of tracks
Or if using Supabase: const { data, error } = await supabase
  .from("radio_tracks")
  .select("*")
  .eq("mood", "focus") */
