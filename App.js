import React, {useState, useEffect, useCallback} from 'react';
import type {Node} from 'react';
import {
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';

const ITEM_HEIGHT = 100;
const Item = React.memo(({title, overview, date, poster}) => {
  console.log('item');
  return (
    <TouchableOpacity>
      <View style={styles.row}>
        <Image
          source={{uri: 'https://image.tmdb.org/t/p/w500' + poster}}
          style={styles.pic}
        />
        <View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
            <Text style={styles.mblTxt}>{date}</Text>
          </View>
          <View style={styles.msgContainer}>
            <Text style={styles.msgTxt}>{overview}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});
const App: () => Node = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    console.log(`Started Loading Movies for Page no ${page}`);
    await axios
      .get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: 'acea91d2bff1c53e6604e4985b6989e2',
          page,
        },
      })
      .then(res => {
        setMovies([...movies, ...res.data.results]);
        console.log(`Finished Loading Movies for Page no ${page}`);
        setPage(page + 1);
      })
      .catch(err => {
        console.log('error');
      });
    setIsLoading(false);
  };

  const renderItem = useCallback(
    ({item}) => (
      <Item
        title={item.title}
        overview={item.overview}
        date={item.release_date}
        poster={item.poster_path}
      />
    ),
    [],
  );
  const listKeyExtractor = useCallback(item => item.id, []);
  const _renderFooter = () => {
    if (!isLoading) {
      return null;
    }

    return <ActivityIndicator size="small" color="#0000ff" />;
  };

  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );
  return (
    <SafeAreaView>
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={listKeyExtractor}
        onEndReachedThreshold={0.01}
        initialNumToRender={20}
        onEndReached={info => {
          loadMovies();
        }}
        ListFooterComponent={_renderFooter}
        getItemLayout={getItemLayout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
    height: ITEM_HEIGHT - 10 * 2,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width: 170,
  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 12,
    marginLeft: 15,
  },
});

export default App;
