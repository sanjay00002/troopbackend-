import { nanoid } from 'nanoid/async';

const getWinner = (id, pool, socket, matched_user) => {
  const getWinnerQuery =
    'SELECT * FROM public."MatchedLiveUsers" WHERE id = $1';
  pool.query(getWinnerQuery, [id], (error, result) => {
    if (error) {
      console.log('No such match found' + error);
    } else {
      const curr_match = result.rows[0];
      const selfPerformance =
        (curr_match.selfStockCloseValue - curr_match.selfStockOpenValue) /
        curr_match.selfStockOpenValue;
      const apponentPerformance =
        (curr_match.apponentStockCloseValue -
          curr_match.apponentStockOpenValue) /
      curr_match.apponentStockOpenValue;

      console.log('self: ' + selfPerformance);
      console.log('apponent: ' + apponentPerformance);
      if (selfPerformance > apponentPerformance) {
        const winner = 'Self';
        const setWinnerQuery =
          'UPDATE public."MatchedLiveUsers" SET "winner" =$1  WHERE "id" = $2';
        pool.query(setWinnerQuery, [winner, id], (error, result) => {
          if (error) {
            console.log(error);
          } else {
            console.log(winner);
            socket.emit('set-winner', winner);
            socket.broadcast
              .to(matched_user.socket_id)
              .emit('set-winner', 'Apponent');
          }
        });
      } else if (selfPerformance < apponentPerformance) {
        const winner = 'Apponent';
        const setWinnerQuery =
          'UPDATE public."MatchedLiveUsers" SET "winner" =$1  WHERE "id" = $2';
        pool.query(setWinnerQuery, [winner, id], (error, result) => {
          if (error) {
            console.log(error);
          } else {
            console.log(winner);

            socket.emit('set-winner', winner);
            socket.broadcast
              .to(matched_user.socket_id)
              .emit('set-winner', 'Self');
          }
        });
      } else {
        const winner = 'Tie';
        console.log(winner);

        socket.emit('set-winner', winner);
        socket.broadcast.to(matched_user.socket_id).emit('set-winner', winner);
      }
    }
  });
};

module.exports = function findMatch(io, socket, pool, user) {
  const userId = user.user_id;
  const socketId = user.socket_id;
  const contestId = user.contest_id;
  const stock_id = user.stock_id;
  const stock_value = user.stock_value;

  const updateQuery =
    'UPDATE public."LiveContestUserPool" SET stock_id = $1, stock_value = $2 WHERE contest_id = $3 AND socket_id = $4';
  pool.query(
    updateQuery,
    [stock_id, stock_value, contestId, socketId],
    (error, result) => {
      if (error) {
        console.error('Error saving contest:', error);
      } else {
        console.log('stock selected successfully');

        const getQuery =
          'SELECT * FROM public."LiveContestUserPool" WHERE contest_id = $1 AND stock_id <> $2 AND matched = false';
        pool.query(getQuery, [contestId, stock_id], (error, result) => {
          if (error) {
            console.log('Error occured:', error);
          } else {
            const matched_user = result.rows[0];
            if (matched_user) {
              const updateQuery2 =
                'UPDATE public."LiveContestUserPool" SET matched = true WHERE (socket_id = $1 AND contest_id = $2) OR id = $3';
              pool.query(
                updateQuery2,
                [socketId, contestId, matched_user.id],
                async (error, result) => {
                  if (error) {
                    console.log('error in matching', error);
                  } else {
                    console.log('matched');
                    const id = await nanoid(10);

                    const matchedQuery =
                      'INSERT INTO public."MatchedLiveUsers" ("id", "selfId", "apponentId", "selfSelectedStockId", "selfStockOpenValue", "apponnetSelectedStockId", "apponentStockOpenValue", "contestId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

                    pool.query(
                      matchedQuery,
                      [
                        id,
                        userId,
                        matched_user.user_id,
                        stock_id,
                        stock_value,
                        matched_user.stock_id,
                        matched_user.stock_value,
                        contestId,
                      ],
                      (error, result) => {
                        if (error) {
                          console.log('error in matching', error);
                        } else {
                          console.log('Matched users registered in history');
                        }
                      },
                    );

                    const deleteQuery =
                      'DELETE FROM public."LiveContestUserPool" WHERE matched = true';
                    pool.query(deleteQuery, (error, result) => {
                      if (error) {
                        console.log('error in deleting', error);
                      } else {
                        console.log('Deleted matched users');
                      }
                    });

                    socket.emit('match-found', matched_user.user_id);
                    socket.broadcast
                      .to(matched_user.socket_id)
                      .emit('match-found', userId);

                    var isEnd = false;

                    var stock1 = [];
                    var stock2 = [];
                    var isFetched = false;
                    socket.on('send-stock-value', (stockFlow) => {
                      if (
                        isFetched === false &&
                        stockFlow.stock1[1] !== null &&
                        stockFlow.stock2[1] !== null
                      ) {
                        console.log(
                          'stock value updated ' +
                            stockFlow.stock1 +
                            ' ' +
                            stock2,
                        );
                        stock1 = stockFlow.stock1;
                        stock2 = stockFlow.stock2;
                      }
                    });

                    setTimeout(() => {
                      if (isEnd !== true) {
                        isFetched = true;

                        console.log(stock1);
                        console.log(stock2);

                        const getQuery =
                          'SELECT * FROM public."MatchedLiveUsers" WHERE id = $1';
                        pool.query(getQuery, [id], async (error, result) => {
                          if (error) {
                            console.log('No such match found' + error);
                          } else {
                            await result;
                            var matchedObject = result.rows[0];
                            console.log('on line 110');
                            console.log(matchedObject);
                            if (
                              matchedObject.selfSelectedStockId === stock1[0]
                            ) {
                              console.log(
                                'Stock1 ' + stock1 + ' Stock2 ' + stock2,
                              );
                              const finalStockUpdateQuery =
                                'UPDATE public."MatchedLiveUsers" SET "selfStockCloseValue" = $1, "apponentStockCloseValue" = $2 WHERE "id" = $3';
                              pool.query(
                                finalStockUpdateQuery,
                                [stock1[1], stock2[1], id],
                                async (error, result) => {
                                  if (error) {
                                    console.log(
                                      'Error while deciding error' + error,
                                    );
                                  } else {
                                    console.log('final stock values fetched');
                                    getWinner(id, pool, socket, matched_user);
                                  }
                                },
                              );
                            } else {
                              const finalStockUpdateQuery =
                                'UPDATE public."MatchedLiveUsers" SET "selfStockCloseValue" = $1, "apponentStockCloseValue" = $2 WHERE "id" = $3';
                              pool.query(
                                finalStockUpdateQuery,
                                [stock2[1], stock1[1], id],
                                (error, result) => {
                                  if (error) {
                                    console.log(
                                      'Error while deciding error' + error,
                                    );
                                  } else {
                                    console.log('final stock values fetched');
                                    getWinner(id, pool, socket, matched_user);
                                  }
                                },
                              );
                            }
                          }
                        });
                      }
                      isEnd = true;
                    }, 5000);
                  }
                },
              );
            }
          }
        });
      }
    },
  );
};
