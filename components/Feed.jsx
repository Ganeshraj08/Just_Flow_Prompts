"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [allPosts, setAllPosts] = useState([]);

  const [searchedPosts, setSearchedPosts] = useState();
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const result = filterPrompts(e.target.value);
        setSearchedPosts(result);
      }, 500)
    );
  };

  const filterPrompts = (text) => {
    const regex = RegExp(text, "i");

    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const fetchPosts = async () => {
    const response = await fetch("api/prompt");
    const data = await response.json();
    setAllPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const result = filterPrompts(tagName);
    setSearchedPosts(result);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex items-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="block w-full rounded-md  border-2 border-gray-200 bg-white py-2.5 pr-12 text-normal shadow-lg font-medium focus:border-sky-300  focus:outline-none focus:ring-0 pl-5"
        />
        <Image
          src="/assets/icons/search.svg"
          width={23}
          height={23}
          alt="search"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer hover:scale-110"
        />
      </form>

      {searchedPosts ? (
        <PromptCardList data={searchedPosts} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
