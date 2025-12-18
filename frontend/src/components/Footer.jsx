import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-white border-t mt-12">
      <div className="w-3/4 md:w-3/4 mx-auto py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">© {new Date().getFullYear()} EventApp — All rights reserved.</div>
        <div className="flex items-center gap-3">
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Privacy</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Terms</a>
          <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Contact</a>
        </div>
      </div>
    </footer>
  )
}
