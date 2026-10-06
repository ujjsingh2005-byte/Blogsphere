import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, PenSquare, Compass, ArrowRight, BookOpen, Layers, Rocket, Flame, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import BlogCard from '../components/blog/BlogCard';
import FeaturedPost from '../components/blog/FeaturedPost';
import SearchFilterBar from '../components/blog/SearchFilterBar';
import Pagination from '../components/common/Pagination';
import { BlogCardSkeleton } from '../components/common/SkeletonLoader';
import BackToTop from '../components/common/BackToTop';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    limit: 9
  });

  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortOption, setSortOption] = useState(sortParam);

  const blogsSectionRef = useRef(null);

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchQuery(searchParam);
    setSortOption(sortParam);
  }, [categoryParam, searchParam, sortParam]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pageParam,
        limit: 9,
        sort: sortOption
      };
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await api.get('/posts', { params });
      if (res.data.success) {
        setPosts(res.data.data.posts);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery, sortOption, pageParam]);

  const updateQueryParam = (newCategory, newSearch, newSort, newPage = 1) => {
    const params = {};
    if (newCategory && newCategory !== 'All') params.category = newCategory;
    if (newSearch) params.search = newSearch;
    if (newSort && newSort !== 'newest') params.sort = newSort;
    if (newPage > 1) params.page = newPage.toString();
    setSearchParams(params);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    updateQueryParam(cat, searchQuery, sortOption, 1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    updateQueryParam(selectedCategory, query, sortOption, 1);
  };

  const handleSortChange = (sort) => {
    setSortOption(sort);
    updateQueryParam(selectedCategory, searchQuery, sort, 1);
  };

  const handlePageChange = (page) => {
    updateQueryParam(selectedCategory, searchQuery, sortOption, page);
    if (blogsSectionRef.current) {
      blogsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isDefaultView = pageParam === 1 && !searchQuery && selectedCategory === 'All';
  const featuredPost = isDefaultView && posts.length > 0 ? posts[0] : null;
  const gridPosts = isDefaultView ? posts.slice(1) : posts;

  return (
    <div className="space-y-16 pb-24">
      {/* ========================================================
          HERO SECTION — ULTRA MODERN MESH & FLOATING GLOW BLOBS
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-indigo-950 to-navy-900 text-white pt-24 pb-28 px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Animated Background Mesh Blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[120px] pointer-events-none animate-blob"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent-pink/15 rounded-full blur-[140px] pointer-events-none animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-accent-purple/20 rounded-full blur-[100px] pointer-events-none animate-blob" style={{ animationDelay: '4s' }}></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          {/* Spark Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 text-xs font-bold text-brand-200 shadow-xl">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>The Premier Modern Publishing Ecosystem</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white font-display">
            Share Your Ideas <br />
            <span className="bg-gradient-to-r from-brand-300 via-accent-purple via-accent-pink to-amber-300 bg-clip-text text-transparent">
              With The World.
            </span>
          </h1>

          {/* Subtitle & Description */}
          <div className="space-y-2 max-w-2xl mx-auto">
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Write. Share. Connect.
            </p>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              Turn your ideas into stories, connect with curious minds, and build your digital voice on a platform engineered for thinkers.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={isAuthenticated ? '/create-post' : '/login'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-accent-purple to-accent-pink hover:from-brand-600 hover:to-accent-pink text-white font-bold text-sm shadow-xl shadow-brand-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Start Writing</span>
            </Link>

            <button
              onClick={() => blogsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span>Explore Blogs</span>
            </button>
          </div>

          {/* Floating Live Community Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Flame className="w-4 h-4 text-amber-400" />
              <span><strong>100%</strong> Open Access</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Users className="w-4 h-4 text-sky-400" />
              <span><strong>Active</strong> Global Creators</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span><strong>Zero</strong> Paywalls</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MAIN DISCOVERY SECTION
          ======================================================== */}
      <div ref={blogsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Featured Editorial Banner */}
        {!loading && featuredPost && (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h2 className="text-xs uppercase tracking-widest font-extrabold text-slate-500 dark:text-slate-400">
                Featured Editorial Spotlight
              </h2>
            </div>
            <FeaturedPost post={featuredPost} />
          </div>
        )}

        {/* Discovery Filter Header */}
        <div className="bg-white dark:bg-navy-850 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2.5">
                <Compass className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                <span>Discover Something New</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Explore ideas, stories and knowledge curated by the community.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400 self-start sm:self-auto px-3 py-1 rounded-full bg-slate-100 dark:bg-navy-900">
              {pagination.totalPosts} total stories
            </span>
          </div>

          <SearchFilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            totalResults={pagination.totalPosts}
          />
        </div>

        {/* Blog Cards Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <BlogCardSkeleton key={n} />
              ))}
            </div>
          ) : gridPosts.length === 0 ? (
            <div className="p-16 text-center bg-white dark:bg-navy-850 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 dark:bg-navy-900 rounded-3xl flex items-center justify-center text-slate-400 mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">No blog posts found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                We couldn't find any articles matching your query or filter. Try another keyword or create your own story.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  updateQueryParam('All', '', 'newest', 1);
                }}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Call To Action Banner */}
        {!isAuthenticated && (
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-white shadow-2xl bg-gradient-to-r from-brand-600 via-accent-purple to-accent-pink">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
                  Ready to share your voice with the world?
                </h3>
                <p className="text-brand-100 text-sm sm:text-base max-w-xl font-light">
                  Join thousands of software engineers, designers, and thinkers who publish their stories on BlogSphere every day.
                </p>
              </div>
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        )}
      </div>

      <BackToTop />
    </div>
  );
};

export default HomePage;
