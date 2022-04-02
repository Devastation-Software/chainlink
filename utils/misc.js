module.exports = {
  convertDirectionToEmoji: function (direction) {
    switch (direction) {
      case 'here':
        return '⬅️';
      case 'there':
        return '➡️';
      default:
        return '↔️';
    }
  },
}