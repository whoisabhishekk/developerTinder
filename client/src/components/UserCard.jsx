import React from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";

const UserCard = ({ user, showActions = true, onAction }) => {
  if (!user) return null;
  const { _id, firstName, lastName, photoUrl, about, gender, age, skills } = user;

  // Framer Motion hooks for swipe gestures
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const controls = useAnimation();

  const handleDragEnd = async (event, info) => {
    const threshold = 120; // pixels before a swipe is considered actioned
    const velocity = info.velocity.x;

    if (info.offset.x > threshold || velocity > 800) {
      // Swiped Right - Interested
      await controls.start({ x: window.innerWidth, transition: { duration: 0.25, ease: "easeOut" } });
      if (onAction) onAction("interested", _id);
    } else if (info.offset.x < -threshold || velocity < -800) {
      // Swiped Left - Ignore
      await controls.start({ x: -window.innerWidth, transition: { duration: 0.25, ease: "easeOut" } });
      if (onAction) onAction("ignore", _id);
    } else {
      // Snap back to center smoothly
      controls.start({ x: 0, transition: { type: "spring", stiffness: 250, damping: 20 } });
    }
  };

  React.useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } });
  }, [controls]);

  return (
    <motion.div 
      style={{ x, rotate, opacity }}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      drag={showActions ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }} // Elastic snap back to origin
      dragElastic={1} // 1 = Card follows finger perfectly without rubber-banding
      onDragEnd={showActions ? handleDragEnd : undefined}
      whileTap={showActions ? { cursor: "grabbing" } : {}}
      className={`card bg-gray-900/40 backdrop-blur-xl border border-white/10 w-full max-w-sm sm:max-w-md md:max-w-lg aspect-[3/4] shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(99,102,241,0.2)] hover:border-white/20 rounded-[2.5rem] overflow-hidden z-10 ${showActions ? 'cursor-grab touch-none' : ''}`}
    >
      {/* Swipe Indicators (Stamps) */}
      {showActions && (
        <>
          <motion.div 
            style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
            className="absolute top-12 left-8 z-30 border-4 border-green-400 text-green-400 rounded-2xl px-6 py-2 font-black text-4xl uppercase tracking-widest rotate-[-15deg] shadow-lg bg-black/20 backdrop-blur-sm"
          >
            LIKE
          </motion.div>
          <motion.div 
            style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}
            className="absolute top-12 right-8 z-30 border-4 border-red-500 text-red-500 rounded-2xl px-6 py-2 font-black text-4xl uppercase tracking-widest rotate-[15deg] shadow-lg bg-black/20 backdrop-blur-sm"
          >
            NOPE
          </motion.div>
        </>
      )}

      {showActions ? (
        // PORTRAIT MODE (Feed)
        <>
          <figure className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <img
              src={
                photoUrl ||
                "https://geographyandyou.com/images/user-profile.png"
              }
              alt={`${firstName} ${lastName}`}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-110"
            />
            {/* Richer, darker gradient for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent opacity-95" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60" />
          </figure>

          <div className="absolute bottom-0 w-full z-20 p-8 sm:p-10 flex flex-col justify-end text-white pointer-events-none">
            {/* Header: Name, Online Status, Age */}
            <div className="flex items-end gap-3 mb-1">
              <h2 className="text-4xl font-black tracking-tighter leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] flex items-center gap-3">
                {firstName} {lastName}
                {/* Online Status Dot */}
                <span className="relative flex h-3 w-3 mt-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
                </span>
              </h2>
              {age && (
                <span className="text-2xl font-bold text-gray-300 drop-shadow-lg mb-0.5">
                  {age}
                </span>
              )}
            </div>

            {/* Gender / Role Badge */}
            {gender && (
              <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase tracking-widest mb-3 drop-shadow-md">
                {gender}
              </p>
            )}

            {/* About Section */}
            {about && (
              <p className="text-sm text-gray-300 mt-2 line-clamp-3 leading-relaxed font-medium drop-shadow-sm max-w-[95%]">
                {about}
              </p>
            )}

            {/* Skills Pills - Premium Glass */}
            {skills && skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="badge badge-md bg-white/10 backdrop-blur-xl text-white border border-white/20 font-bold px-4 py-3 text-xs shadow-lg shadow-black/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Top Right 'New' Badge for extra flair */}
          <div className="absolute top-6 right-6 z-20 pointer-events-none">
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest opacity-90">New</span>
            </div>
          </div>

          <p className="absolute bottom-4 w-full text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse opacity-50 pointer-events-none">
            Swipe left or right
          </p>
        </>
      ) : (
        // CIRCULAR MODE (Edit Profile Live Preview)
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 pointer-events-none">
          <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-6 flex-shrink-0 relative">
            <img
              src={
                photoUrl ||
                "https://geographyandyou.com/images/user-profile.png"
              }
              alt={`${firstName} ${lastName}`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 rounded-full shadow-inner ring-1 ring-white/10"></div>
          </div>

          <div className="flex flex-col items-center text-center w-full">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white drop-shadow-md">
                {firstName} {lastName}
              </h2>
              {age && (
                <span className="text-xl font-medium text-gray-300 drop-shadow-md">
                  {age}
                </span>
              )}
            </div>

            {gender && (
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 drop-shadow-md">
                {gender}
              </p>
            )}

            {about && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-3 sm:line-clamp-4 leading-relaxed font-medium">
                {about}
              </p>
            )}

            {skills && skills.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="badge badge-sm sm:badge-md bg-white/10 backdrop-blur-md text-gray-200 border-white/5 font-medium px-3 py-2 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserCard;