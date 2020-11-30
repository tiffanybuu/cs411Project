import { useForm } from "react-hook-form";
import React, { useState } from "react";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Heading
} from "@chakra-ui/core";
import Hero from '../components/Hero';
import Entry from '../components/Entry';
import Container from '../components/Container';

const handleSubmit = () => {
  returnGetResults(1);
  console.log(passwordRef.current.value, "<Entry songId=\"0\" songURL={this.Props} />");
};

export default function Add() {
  const { handleSubmit, errors, register, formState } = useForm();

  function validateSong(value) {
    let error;
    if (!value) {
      error = "Entry is required";
    }
    return error || true;
  }

  function onSubmit(values) {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
    }, 1000);
  }

  const [getResults, returnGetResults] = React.useState(0)

  return (
    <Box>
    <Box
      textAlign={['center', 'center', 'center', 'center']}
      maxW="1000px"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      alignSelf="center"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">Insert Spotify song embed URI</FormLabel>
          <Input
            name="URI here"
            placeholder="URI here"
            ref={register({ validate: validateSong })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          mt={4}
          variantColor="pink"
          isLoading={formState.isSubmitting}
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </form>
    </Box>


    { returnGetResults ? <Results /> : null}

    </Box>
  );
}

const Results = () => (
  <div id="results">
    <Entry
      songId="0"
      songURL="https://open.spotify.com/embed/track/4mL59LVbKgOpEACxraGYdr"
    />
    <Entry
      songId="1"
      songURL="https://open.spotify.com/embed/track/4mL59LVbKgOpEACxraGYdr"
    />
  </div>
)
