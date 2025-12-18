import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">About <span className='text-blue-500'>EVENTS-ON</span> app </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            Connecting communities through unforgettable experiences.
                        </p>
                    </div>
                    <div className="mt-12 lg:mt-0 lg:col-span-2">
                        <div className="space-y-12">
                            <div className="space-y-5 sm:space-y-4">
                                <h3 className="text-2xl font-bold leading-6 font-medium text-gray-900">Our Mission</h3>
                                <p className="text-lg text-gray-500">
                                    We believe that the best stories are written together. That's why we've built a platform that makes it effortless for anyone to create, discover, and join events that matter. Whether it's a small tech meetup, a local concert, or a grand conference, EventApp is your partner in bringing people together.
                                </p>
                                <p className="text-lg text-gray-500">
                                    Our goal is to simplify event management so you can focus on what truly counts: the people and the experience.
                                </p>
                            </div>

                            <div className="space-y-5 sm:space-y-4">
                                <h3 className="text-2xl font-bold leading-6 font-medium text-gray-900">Get Involved</h3>
                                <p className="text-lg text-gray-500">
                                    Ready to start your journey? <Link to="/create" className="text-indigo-600 hover:text-indigo-500 font-medium">Create an event</Link> today or <Link to="/events" className="text-indigo-600 hover:text-indigo-500 font-medium">browse</Link> what's happening near you.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
