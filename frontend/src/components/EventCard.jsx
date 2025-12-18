import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../api/api'

export default function EventCard({ event, onRsvp, onDelete, currentUser }) {
    const navigate = useNavigate()
    const isCreator = currentUser && (event.creator === currentUser.id || event.creator === currentUser._id);
    const isAdmin = currentUser?.isAdmin;
    const showDelete = isCreator || isAdmin;

    const isAttending = currentUser && event.attendees && event.attendees.some(a => a === currentUser.id || a._id === currentUser.id);

    // Date formatting
    const dateObj = event.datetime ? new Date(event.datetime) : null;
    const month = dateObj ? dateObj.toLocaleString('default', { month: 'short' }) : 'TBA';
    const day = dateObj ? dateObj.getDate() : '--';
    const timeStr = dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <div
            onClick={() => navigate(`/events/${event._id}`)}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden border border-gray-100 transform hover:-translate-y-1 cursor-pointer"
        >
            {/* Image Container with Date Badge */}
            <div className="relative h-48 bg-gray-200">
                {event.imageUrl ? (
                    <img
                        src={`${API_URL}${event.imageUrl}`}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-2 text-center min-w-[3.5rem]">
                    <div className="text-xs font-bold text-red-500 uppercase tracking-wider">{month}</div>
                    <div className="text-xl font-extrabold text-gray-900">{day}</div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Meta Row: Time & Location */}
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
                    {timeStr && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {timeStr}
                        </div>
                    )}
                    {event.location && (
                        <div className="flex items-center truncate">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.242-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="truncate max-w-[150px]">{event.location}</span>
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight hover:text-indigo-600 transition-colors cursor-default">
                    {event.title}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                    {event.description}
                </p>

                {/* Footer: Attendees & Actions */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
                        <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {event.attendees?.length || 0} <span className="text-gray-400 mx-1">/</span> {event.capacity}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onRsvp(event._id); }}
                            className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${isAttending
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500'
                                : 'bg-green-50 text-green-600 hover:bg-green-100 focus:ring-green-500'}`}
                            title={isAttending ? "Remove RSVP" : "Add RSVP"}
                        >
                            {isAttending ? (
                                // Remove Icon (Minus/Trash)
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                // Add Icon (Plus)
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            )}
                        </button>

                        {(isCreator || isAdmin) && (
                            <>
                                <Link
                                    to={`/events/${event._id}/edit`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                                    title="Edit"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </Link>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(event._id); }}
                                    className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                                    title="Delete"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
