getCurrentUrl = () => {
  try {
    currentLoc = window.location.href
    urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    if (urlRegex.test(currentLoc)) {
      return window.location.href
    }
    throw "Sorry, we cannot work on invalid URL: " + currentLoc
  }
  catch(err) {
    return err
  }
}
