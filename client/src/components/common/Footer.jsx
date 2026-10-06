import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Github, Twitter, Linkedin, BookOpen, Layers } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-navy-950 text-slate-300 border-t border-slate-800 dark:border-slate-800/80 pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 via-accent-purple to-accent-pink flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight font-display">
                BLOGSPHERE
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              A modern, community-driven blogging ecosystem engineered for insightful writers, tech innovators, and passionate readers worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-navy-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-navy-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-navy-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Explore Stories
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link to="/?category=Technology" className="hover:text-white transition-colors">
                  Technology News
                </Link>
              </li>
              <li>
                <Link to="/?category=AI" className="hover:text-white transition-colors">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link to="/?category=Programming" className="hover:text-white transition-colors">
                  Software Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <Link
                  key={cat}
                  to={`/?category=${encodeURIComponent(cat)}`}
                  className="px-3 py-1 text-xs rounded-lg bg-slate-800 dark:bg-navy-900 text-slate-300 hover:bg-brand-600 hover:text-white transition-all hover:scale-105"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Stay Inspired
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Receive the finest tech essays and design walkthroughs curated weekly in your inbox.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to BlogSphere!');
              }}
              className="space-y-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-slate-800/90 dark:bg-navy-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-brand-600 to-accent-purple hover:from-brand-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
              >
                Join Newsletter
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BlogSphere Platform. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>using React, Node.js & MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
